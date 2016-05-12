/**
 * Usuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var promisify = require('bluebird').promisify,
    bcrypt = require('bcrypt-nodejs');
module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,

    attributes: {
        username: {
            type: 'string',
            unique: true,
            required: true
        },
        email: {
            type: 'email',
            unique: true,
            required: true
        },
        password: {
            type: 'string',
            required: true,
            columnName: 'encrypted_password',
            minLength: 8
        },
        nombre: {
            type: 'string'
        },
        apellido: {
            type: 'string'
        },
        location: {
            type: 'string'
        },
        date_registered: {
            type: 'date'
        },
        date_verified: {
            type : 'date'
        },
        // Cliente para acceder a la API
        cliente: {
            collection: 'cliente',
            via: 'usuario'
        },
        // Tokens usados por el Usuario
        tokens: {
            collection: 'token',
            via: 'usuario'
        },
        // Estado del Usuario
        estado: {
            model: 'estado'
        },
        // Rol del Usuario
        rol: {
            model: 'rol'
        },
        // Servicios del Usuario
        servicios: {
            collection: 'servicio',
            via: 'usuario',
            through: 'serviciousuario'
        },
        // Etiquetas del Usuario
        etiquetas: {
            collection: 'etiqueta',
            via: 'usuarios',
            dominant: true
        },
        // Archivos del Usuario
        archivos: {
            collection: 'archivo',
            via: 'usuarios',
            dominant: true
        },
        // Publicaciones del Usuario
        publicaciones: {
            collection: 'publicacion',
            via: 'usuario'
        },
        // Gastos registrados por el Usuario
        gastos: {
            collection: 'gasto',
            via: 'usuario'
        },
        // Gastos donde está involucrado el Usuario
        gastosusuario: {
            collection: 'gasto',
            via: 'usuarios'
        },

        comparePassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        },

        toJSON: function() {
            if(this.toObject){
                var
                    obj = this.toObject(),
                    blackList = ['password', 'cliente', 'tokens']
                ;
                blackList.filter(function(val){
                    delete obj[val];
                });
                obj.nombre = obj.nombre || obj.username;
                return obj;
            }
            return this;
        }

    },

    beforeCreate: function(user, next) {
        if (user.hasOwnProperty('password')) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
            next(false, user);
        } else {
            next(null, user);
        }
    },


    beforeUpdate: function(user, next) {
        if (user.hasOwnProperty('password')) {
            Usuario.findOne({id: user.id}, function(err, usr){
                if(err || !usr){
                    next('invalid user');
                }
                if(usr.password === user.password){
                    delete user.password;
                }else{
                    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
                }
                next(false, user);
            });
        } else {
            next(null, user);
        }
    },

    authenticate: function (username, password) {
        return API.Model(Usuario).findOne({username: username}).then(function(user){
            return (user && user.date_verified && user.comparePassword(password))? user : null;
        });
    }

};
