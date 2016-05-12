/**
 * Archivo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        // Nombre como se muestra el Archivo
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
        // Nombre como se guardó el Archivo
        filename: {
            type: 'string',
            unique: true,
            required: true
        },
        // Src para acceder al Archivo
        src: {
            type: 'string',
            unique: true,
            required: true
        },
        // Tamaño del Archivo
        size: {
            type: 'float',
            required: true
        },
        // Extensión del Archivo
        ext: {
            type: 'string',
            maxLength: 5,
            required: true
        },
        // Tipo del Archivo
        tipo: {
            model: 'tipo',
            required: true
        },
        // Estado del Archivo
        estado: {
            model: 'estado'
        },
        // Pago donde está asignado el Archivo
        pago: {
            model: 'pago'
        },
        // Gasto donde está asignado el Archivo
        gasto: {
            model: 'gasto'
        },
        // Servicio donde está asignado el Archivo
        servicio: {
            model: 'servicio'
        },
        // Menú donde está asignado el Archivo
        menu: {
            model: 'menu'
        },
        // Página donde está asignado el Archivo
        pagina: {
            model: 'pagina',
            via: 'archivos'
        },
        // Usuarios del Archivo
        usuarios: {
            collection: 'usuario',
            via: 'archivos'
        },
        // Publicaciones del Archivo
        publicaciones: {
            collection: 'publicacion',
            via: 'archivos'
        },
        // Etiquetas del Archivo
        etiquetas: {
            collection: 'etiqueta',
            via: 'archivos',
            dominant: true
        }
    }
};
