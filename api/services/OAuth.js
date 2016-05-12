/**
 * Created by hender on 16/04/16.
 */

/**
 * Module dependencies.
 */
var promisify = require('bluebird').promisify,
    passport = require('passport'),
    oauth2orize = require('oauth2orize'),

    PublicClientPasswordStrategy = require('passport-oauth2-public-client').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,

    server = oauth2orize.createServer(), // create OAuth 2.0 server service
    validateAndSendToken = promisify(server.token()),
    tokenErrorMessage = server.errorHandler(),

//Handlers
    publicClientVerifyHandler,
    bearerVerifyHandler,
    clientPasswordHandler,
    exchangePasswordHandler,
    exchangeRefreshTokenHandler,
    exchangeClientCredentialsHandler;

/**
 * Public Client strategy
 *
 * The OAuth 2.0 public client authentication strategy authenticates clients
 * using a client ID. The strategy requires a verify callback,
 * which accepts those credentials and calls done providing a client.
 */

publicClientVerifyHandler = function (clientId, next) {
    process.nextTick(function () {
        API.Model(Cliente).findOne({client_id: clientId}).nodeify(next);
    });
};

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
bearerVerifyHandler = function(token, next) {
    process.nextTick(function () {
        Token.authenticate({access_token:token}).nodeify(function (err, info) {
            if (!info || !info.identity) return next(null, null);
            next(null, info.identity, info.authorization);
        });
    });
};

clientPasswordHandler = function(clientId, clientSecret, cb){
    API.Model(Cliente).findOne({
        client_id: clientId,
        client_secret: clientSecret
    }).then(function(cliente){
        return cb(null, cliente);
    }).catch(function(err){
        //sails.log.error(err);
        return cb(null, false);
    });
};

/**
 * Exchange user id and password for access tokens.
 *
 * The callback accepts the `client`, which is exchanging the user's name and password
 * from the token request for verification. If these values are validated, the
 * application issues an access token on behalf of the user who authorized the code.
 */
exchangePasswordHandler = function(client, username, password, scope, body, next) {
    if (!client){
        API.Model(Cliente).findOne({client_id: body.client_id}).then(function(cliente){
            return validateUser(cliente);
        }).catch(function(err){
            return next(null, false); //passport-oauth2-client-password needs to be configured
        });
    }else{
        validateUser(client);
    }
    //Validate the user
    function validateUser(client){
        if(!!client.date_verified){
            return Usuario.authenticate(username, password).then(function (user) {
                if (!user) return next(null, false);
                return Token.generateToken({
                    client_id: client.client_id,
                    usuario: user.id
                }).then(function (token) {
                    return next(null, token.access_token, token.refresh_token, {
                        expires_in: token.calc_expires_in()
                    });
                });
            });
        }
        return next(null, false);
    }
};

/**
 * Exchange the refresh token for an access token.
 *
 * The callback accepts the `client`, which is exchanging the client's id from the token
 * request for verification.  If this value is validated, the application issues an access
 * token on behalf of the client who authorized the code
 */
exchangeRefreshTokenHandler = function (client, refreshToken, scope, done) {
    API.Model(Token).findOne({
        refresh_token: refreshToken
    }).then(function (token) {
        if (!token) return done(null, null);

        return Token.generateToken({
            usuario: token.usuario,
            user_id: token.usuario.id,
            client_id: token.client_id,
            refresh_token: token.refresh_token
        }).then(function (token) {
            return done(null, token.access_token, token.refresh_token, {
                expires_in: token.calc_expires_in()
            });

        });
    }).catch(function (err) {
        done(err);
    });

};

exchangeClientCredentialsHandler = function(client, scope, body, done){
    if(!client){
        /*API.Model(Cliente).findOne({
            client_id: body.client_id,
            client_secret: body.client_secret
        }).then(function(cliente){
            return done(null, cliente);
        }).catch(function(err){
            return done(null, false);
        });*/
        return done(null, false);
    }else{
        return done(null, client);
    }
};

//Initialize Passport Strategies
passport.use(new PublicClientPasswordStrategy(publicClientVerifyHandler));
passport.use(new BearerStrategy(bearerVerifyHandler));
//passport.use(new ClientPasswordStrategy(clientPasswordHandler));
server.exchange(oauth2orize.exchange.password(exchangePasswordHandler));
server.exchange(oauth2orize.exchange.refreshToken(exchangeRefreshTokenHandler));
//server.exchange(oauth2orize.exchange.clientCredentials(exchangeClientCredentialsHandler));

module.exports = {
    authenticator: passport,
    server: server,

    //OAuth Token Services
    sendToken: function (data, context, req, res) {
        if (req.method != 'POST') throw 'Unsupported method';
        if(data.client_id){
            return API.Model(Cliente).findOne({client_id: data.client_id}).then(function(client){
                if(!client.date_verified){
                    return {
                        error: true,
                        message: 'Client is not Active'
                    };
                }else{
                    return validAndSend();
                }
            });
        }else{
            validAndSend();
        }
        function validAndSend(){
            return validateAndSendToken(req, res).catch(function (err) {
                tokenErrorMessage(err, req, res);
            });
        }
    },

    tokenInfo: function (data, context) {
        var token = context.authorization.token;
        token.expires_in = token.calc_expires_in();
        return {
            identity: context.identity,
            authorization: context.authorization
        };
    }
};
