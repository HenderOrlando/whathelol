/**
 * Rol.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        nombre: {
            type: 'string',
            unique: true,
            required: false
        },
        canonical: {
            type: 'string',
            unique: true
        },
        descripcion: {
            type: 'text'
        },
        serviciousuarios: {
            collection: 'serviciousuario',
            via: 'rol'
        },
        usuarios: {
            collection: 'usuario',
            via: 'rol'
        },
        permisos: {
            collection: 'permiso',
            via: 'roles',
            dominant: true
        }
    }
};

