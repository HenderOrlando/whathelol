/**
 * Estado.js
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
        // Elementos al que es aplicable el estado.
        // Pago, Usuario, Página, Archivo, Publicación
        estadoDe: {
            type: 'string',
            required: true,
            enum: [
                'pago',
                'gasto',
                'usuario',
                'pagina',
                'archivo',
                'publicacion'
            ]
        },
        // Pagos con el Estado
        pagos: {
            collection: 'pago',
            via: 'estado'
        },
        // Gastos con el Estado
        gastos: {
            collection: 'gasto',
            via: 'estado'
        },
        // Usuarios con el Estado
        usuarios: {
            collection: 'usuario',
            via: 'estado'
        },
        // Páginas con el Estado
        paginas: {
            collection: 'pagina',
            via: 'estado'
        },
        // Archivos con el Estado
        archivos: {
            collection: 'archivo',
            via: 'estado'
        },
        // Publicaciones con el Estado
        publicaciones: {
            collection: 'publicacion',
            via: 'estado'
        },
        // Servicio del Usuario con el Estado
        serviciousuarios: {
            collection: 'serviciousuario',
            via: 'estado'
        }
    }
};

