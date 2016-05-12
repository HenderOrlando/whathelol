/**
 * Serviciousuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        // Servicio asociado al Usuario
        servicio: {
            model: 'servicio'
        },
        // Usuario asociado al servicio
        usuario: {
            model: 'usuario'
        },
        // Rol del Usuario en el servicio
        rol: {
            model: 'rol'
        },
        // Estado del Servicio usado por el Usuario
        estado: {
            model: 'estado'
        },
        // Pagos realizados por el Usuario para tener el servicio
        pagos: {
            collection: 'pago',
            via: 'serviciousuario'
        }
    }
};

