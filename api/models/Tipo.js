/**
 * Tipo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        nombre: {
            type: 'string',
            unique: true,
            required: true
        },
        canonical: {
            type: 'string',
            unique: true
        },
        // Elementos al que es aplicable el tipo.
        // Archivo, Menú, Página, Servicio, Publicación
        tipoDe: {
            type: 'string',
            required: true,
            enum: [
                'archivo',
                'menu',
                'pagina',
                'servicio',
                'publicacion'
            ]
        },
        descripcion: {
            type: 'text'
        },
        abreviacion: {
            type: 'string',
            maxLength: 10
        },
        detalles:{
            type: 'string',
            unique: true
        },
        // Archivos con el Tipo
        archivos: {
            collection: 'archivo',
            via: 'tipo'
        },
        // Menús con el Tipo
        menus: {
            collection: 'menu',
            via: 'tipo'
        },
        // Páginas con el Tipo
        paginas: {
            collection: 'pagina',
            via: 'tipo'
        },
        // Servicios con el Tipo
        servicios: {
            collection: 'servicio',
            via: 'tipo'
        },
        // Publicaciones con el Tipo
        publicaciones: {
            collection: 'publicacion',
            via: 'tipo'
        }
    }
};
