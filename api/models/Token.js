/**
 * Token.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Promise = require('bluebird'),
    promisify = Promise.promisify,
    randToken = require('rand-token');


module.exports = {


    attributes: {

        access_token: {
            type: 'string',
            required: true,
            unique: true
        },

        refresh_token: {
            type: 'string',
            required: true,
            unique: true
        },

        code: {
            type: 'string',
            unique: true
        },

        user_id: {
            type: 'string'
        },

        usuario: {
            model: 'usuario'
            //required: true
        },

        expiration_date: {
            type: 'date'
        },

        client_id: {
            type: 'string',
            required: true
        },

        security_level: {
            type: 'string'
        },

        scope: {
            type: 'string'
        },

        calc_expires_in: function () {
            return Math.floor(new Date(this.expiration_date).getTime() / 1000 - new Date().getTime() / 1000);
        },

        toJSON: function () {
            var hiddenProperties = ['id','access_token','refresh_token','code','usuario','user_id','client_id'],
                obj = this.toObject();

            obj.expires_in = (typeof this.expires_in === 'function' && this.expires_in()) || this.calc_expires_in();

            hiddenProperties.forEach(function(property){
                delete obj[property];
            });

            return obj;
        }

    },


    authenticate: function (criteria) {
        var tokenInfo,
            $Token = API.Model(Token),
            $Usuario = API.Model(Usuario),
            $Cliente = API.Model(Cliente),
            $result;
        if (criteria.access_token) {
            $result = $Token.findOne({access_token: criteria.access_token});
        }
        else if (criteria.code) {
            $result = $Token.findOne({code: criteria.code});
        }
        else {
            //Bad Token Criteria
            return Promise.reject("Unauthorized");
        }

        return $result.then(function (token) {
            if (!token) return null;

            // Handle expired token
            if (token.expiration_date && new Date() > token.expiration_date) {
                return $Token.destroy({access_token: token}).then(function () {
                    return null
                });
            }

            tokenInfo = token;
            if (token.usuario != null && !criteria.client) {
                return $Usuario.findOne({id: token.usuario});
            }
            else {
                //The request came from a client only since userID is null
                //therefore the client is passed back instead of a user
                return $Cliente.findOne({client_id: token.client_id});
            }

        }).then(function (identity) {

            // to keep this example simple, restricted scopes are not implemented,
            // and this is just for illustrative purposes

            if (!identity) return null;
            else if (criteria.type == 'verification') {
                if (identity.email != criteria.email || identity.date_verified){
                    return null;
                }
            }
            // Otherwise if criteria.type != 'verfication'
            else if (!identity.date_verified) return null;

            return {
                identity: identity,
                authorization: {
                    scope: tokenInfo.scope,
                    token: tokenInfo
                }
            };
        });
    },

    generateTokenString: function () {
        return randToken.generate(sails.config.security.oauth.token.length);
    },
    generateToken: function (criteria) {

        //if (err) return next(err);

        var token = {},
            accessToken,
            $Token = API.Model(Token);

        if (!criteria.client_id) return Promise.resolve(null);

        token.client_id = criteria.client_id;
        token.user_id = token.usuario = criteria.usuario || undefined;
        criteria.user_id = token.usuario;


        token.access_token = accessToken = Token.generateTokenString();

        token.refresh_token = Token.generateTokenString();
        token.code = Token.generateTokenString();

        if (!criteria.expiration_date) {
            token.expiration_date = new Date();
            token.expiration_date.setTime(token.expiration_date.getTime() + sails.config.security.oauth.token.expiration * 1000 + 999);
        }

        return $Token.findOrCreate(criteria, token).then(function (retrievedToken) {
        //return $Token.findOne(criteria).then(function (retrievedToken) {
            //sails.log(retrievedToken)
            if (retrievedToken.access_token != accessToken) {
                if(retrievedToken.refresh_token === criteria.refresh_token && !isExpired(retrievedToken.expiration_date)){
                    return $Token.update(criteria, token).then(function (updatedTokens) {
                        return updatedTokens[0];
                    });
                }else{
                    /*return $Token.create(token).then(function (createdToken) {
                        return createdToken;
                    });*/
                    return $Token.update(criteria, token).then(function (updatedToken) {
                        return updatedToken[0];
                    });
                }
                /*return $Token.update(criteria, token).then(function (updatedToken) {
                    return updatedToken[0];
                });*/
            }
            return retrievedToken;
        });

        function isExpired(date){
            var now = new Date();
            date = new Date(date);
            return now.getTime() > date.getTime()
        }
        /*return $Token.create(criteria, token).then(function (retrievedToken) {
            return retrievedToken;
        });*/

    }
};
