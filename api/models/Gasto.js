/**
 * Gasto.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        nombre: {
            type: 'string'
        },
        canonical: {
            type: 'string'
        },
        // Usuario que registra el gasto del Servicio
        usuario:{
            model: 'usuario',
            required: true
        },
        // Usuarios involucrados en el gasto del Servicio
        usuarios:{
            collection: 'usuario',
            via: 'gastosusuario',
            dominant: true
        },
        // Servicio que registra el gasto
        servicio:{
            model: 'servicio',
            required: true
        },
        valor: {
            type: 'float',
            required: true
        },
        // Estado del Gasto
        estado: {
            model: 'estado'
        },
        // Archivos del Gasto
        archivos: {
            collection: 'archivo',
            via: 'gasto',
            dominant: true
        },
        // Etiquetas del Gasto
        etiquetas: {
            collection: 'etiqueta',
            via: 'gastos',
            dominant: true
        }
    }
};

