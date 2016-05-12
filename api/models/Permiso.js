/**
 * Permiso.js
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
      // Acción que permitida en el modelo el permiso
      accion: {
          type: 'string',
          required: true,
          enum: [
              'actualizar',
              'borrar',
              'crear',
              'leer'
          ]
      },
      // Modelo donde es permitida la acción
      modelo: {
          type: 'string',
          required: true,
          enum: [
              'serviciousuario',
              'publicacion',
              'etiqueta',
              'servicio',
              'usuario',
              'archivo',
              'estado',
              'pagina',
              'gasto',
              'pago',
              'tipo',
              'menu',
              'rol'
          ]
      },
      // Dónde es permitido realizar la acción en el modelo
      aplicable: {
          type: 'string',
          required: true,
          enum: [
              'servicio', // Para el servicio donde está agregado
              'usuario', // Para el modelo donde es el dueño
              'todo' // Para el sistema
          ]
      },
      roles: {
          collection: 'rol',
          via: 'permisos'
      }
  }
};

