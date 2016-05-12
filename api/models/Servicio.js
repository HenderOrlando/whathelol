/**
 * Servicio.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        nombre: {
            type: 'string',
            required: true
        },
        canonical: {
            type: 'string'
        },
        descripcion: {
            type: 'text'
        },
        // Tipo de Servicio
        tipo: {
            model: 'tipo',
            required: true
        },
        // Página del Servicio
        pagina: {
            model: 'pagina'
        },
        // Archivos del Servicio
        archivos: {
            collection: 'archivo',
            via: 'servicio'
        },
        // Usuarios del Servicio
        usuarios: {
            collection: 'usuario',
            via: 'servicio',
            through: 'serviciousuario'
        },
        // Etiquetas del Servicio
        etiquetas: {
            collection: 'etiqueta',
            via: 'servicios',
            dominant: true
        },
        // Gastos del Servicio
        gastos: {
            collection: 'gasto',
            via: 'servicio'
        }
    }
};

