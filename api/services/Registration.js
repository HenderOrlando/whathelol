/**
 * Created by hender on 16/04/16.
 */

var Promise = require('bluebird'),
    promisify = Promise.promisify,
    mailer = require('nodemailer'),
    emailGeneratedCode,
    transporter;


/*transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: sails.config.security.admin.email.address,
        pass: sails.config.security.admin.email.password
    }
});*/
transporter = mailer.createTransport({
    host: sails.config.security.admin.email.host,
    port: sails.config.security.admin.email.port,
    secure: true, // use SSL
    auth: {
        user: sails.config.security.admin.email.address,
        pass: sails.config.security.admin.email.password
    }
});

emailGeneratedCode = function (options) {
    var url = options.verifyURL,
        email = options.email;


    message = 'Hola!';
    message += '<br/>';
    message += 'Visita el link para confirmar el registro puedas ingresar a la App.';
    message += '<br/><br/>';
    message += 'Ingresa con ' + options.type + " : " + options.id;
    message += '<br/><br/>';
    message += '<a href="';
    message += url;
    message += '">Click para confirmar registro</a>';
    message += '<br/>';

    transporter.sendMail({
        from: sails.config.security.admin.email.address,
        to: email,
        subject: 'Registro en Soluciones Cúcuta',
        html: message
    }, function (err, info) {
        if(err){
            return sails.log.error(err);
        }
        sails.log("Email Response:", info);
    });

    return {
        url: url
    }
};

module.exports = {
    emailGeneratedCode: emailGeneratedCode,
    currentUser: function(data,context){
        return context.identity;
    },
    registerUser: function (data, context) {
        var date = new Date();
        return API.Model(Usuario).create({
            username: data.username,
            email: data.email,
            password: data.password,
            date_registered: date
        }).then(function (user) {
            context.id = user.username;
            context.type = 'Username';
            return API.Model(Cliente).create({
                usuario: user,
                client_id: Token.generateTokenString(),
                client_secret: Token.generateTokenString(),
                email: data.email,
                date_registered: date
            }).then(function (client) {
                /*context.id = client.client_id;
                context.type = 'Client ID';*/

                return Token.generateToken({
                    usuario: user.id,
                    client_id: client.client_id
                });
            }, function(err){
                API.Model(Usuario).destroy({id: user.id});
                return err;
            });
        }).then(function (token) {
            if(token.id){
                return emailGeneratedCode({
                    id: context.id,
                    type: context.type,
                    //verifyURL: sails.config.security.server.url + "/usuario/verify/" + data.email + "?code=" + token.code,
                    verifyURL: sails.config.security.server.url + "/auth/verify/" + data.email + "?code=" + token.code,
                    email: data.email
                });
            }
            return token;
        });

    },

    verifyUser: function (data, context) {
        return Token.authenticate({
            code: data.code,
            type: 'verification',
            email: data.email
        }).then(function (info) {

            var date = new Date();
            if (!info) return Promise.reject('Unauthorized');

            API.Model(Usuario).findOne({
                email: info.identity.email
            }).then(function(user){
                if(!user.date_verified){
                    user.date_verified = date;
                    user.save();
                }
            });

            return {
                verified: true,
                email: info.identity.email
            }
        });
    },

    registerClient: function (data, context) {
        return API.Model(Cliente).create({
            client_id: Token.generateTokenString(),
            client_secret: Token.generateTokenString(),
            email: data.email
        }).then(function (client) {
            context.id = client.client_id;
            context.type = 'Client ID';

            return Token.generateToken({
                client_id: client.client_id
            });
        }).then(function (token) {
            return emailGeneratedCode({
                id: context.id,
                type: context.type,
                verifyURL: sails.config.security.server.url + "/cliente/verify/" + data.email + "?code=" + token.code,
                email: data.email
            });
        });
    },


    verifyClient: function (data, context) {
        return Token.authenticate({
            type: 'verification',
            code: data.code,
            email: data.email,
            client: data.client
        }).then(function (info) {
            var date = new Date();
            if (!info) return Promise.reject('Unauthorized');

            API.Model(Cliente).update(
                {
                    client_id: info.identity.client_id
                },
                {
                    date_verified: date
                }
            );

            return {
                verified: true,
                email: info.identity.email
            };
        });
    }
};
