/**
 * Pago.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        // Usuario que paga el Servicio
        serviciousuario:{
            model: 'serviciousuario',
            required: true
        },
        valor: {
            type: 'float',
            required: true
        },
        // Estado del Pago
        estado: {
            model: 'estado'
        },
        // Archivos del Pago
        archivos: {
            collection: 'archivo',
            via: 'pago'
        },
        // Etiquetas del Pago
        etiquetas: {
            collection: 'etiqueta',
            via: 'pagos',
            dominant: true
        }
    }
};
