/**
 * Menu.js
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
        // Tipo del Menú
        tipo: {
            model: 'tipo',
            required: true
        },
        // Submenus del Menú
        submenu: {
            collection: 'menu',
            via: 'menu'
        },
        // Menú al que pertenece
        menu: {
            model: 'menu'
        },
        // Etiquetas del Menú
        etiquetas: {
            collection: 'etiqueta',
            via: 'menus',
            dominant: true
        },
        // Archivos del Menú
        archivos: {
            collection: 'archivo',
            via: 'menu'
        }
    }
};

