/**
 * Etiqueta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        nombre: {
            type: 'string',
            required: true,
            unique: true
        },
        canonical: {
            type: 'string',
            unique: true
        },
        // Menú con la Etiqueta
        menus: {
            collection: 'menu',
            via: 'etiquetas'
        },
        // Archivos con la Etiqueta
        archivos: {
            collection: 'archivo',
            via: 'etiquetas'
        },
        // Servicios con la Etiqueta
        servicios: {
            collection: 'servicio',
            via: 'etiquetas'
        },
        // Usuarios con la Etiqueta
        usuarios: {
            collection: 'usuario',
            via: 'etiquetas'
        },
        // Gastos con la Etiqueta
        gastos: {
            collection: 'gasto',
            via: 'etiquetas'
        },
        // Pagos con la Etiqueta
        pagos: {
            collection: 'pago',
            via: 'etiquetas'
        },
        // Publicaciones con la Etiqueta
        publicaciones: {
            collection: 'publicacion',
            via: 'etiquetas'
        },
        // Publicaciones con la Etiqueta
        paginas: {
            collection: 'pagina',
            via: 'etiquetas'
        }
    }
};

