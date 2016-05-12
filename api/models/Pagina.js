/**
 * Pagina.js
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
        // Tipo de la Página
        tipo: {
            model: 'tipo',
            required: true
        },
        // Estado de la Página
        estado: {
            model: 'estado',
            required: true
        },
        // Archivos de la Página
        archivos: {
            collection: 'archivo',
            via: 'pagina'
        },
        // Servicios de la Página
        servicios: {
            collection: 'servicio',
            via: 'pagina'
        },
        // Etiquetas de la Página
        etiquetas: {
            collection: 'etiqueta',
            via: 'paginas',
            dominant: true
        }
    }
};

