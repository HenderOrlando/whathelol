/**
 * Publicacion.js
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
            type: 'string',
            required: true
        },
        contenido: {
            type: 'text',
            required: true
        },
        // Fecha en que se publica, si es futura, o publicó si es pasado o actual
        fechaPublicado: {
            type: 'datetime'
        },
        usuario: {
            model: 'usuario',
            required: true
        },
        tipo: {
            model: 'tipo',
            required: true
        },
        estado: {
            model: 'estado'
        },
        archivos: {
            collection: 'archivo',
            via: 'publicaciones',
            dominant: true
        },
        etiquetas: {
            collection: 'etiqueta',
            via: 'publicaciones',
            dominant: true
        },

        hasPublicated: function(){
            return new Date(this.fechaPublicado).getTime() <= new Date().getTime();
        }
    },

    checkFechaPublicado: function(values, cb){
        var estado = API.Model(Estado);
        /*if(values.estado && !values.fechaPublicado) {
            estado.findOne({id: values.estado}).then(function (estado) {
                if (estado.canonical === 'publicado') {
                    values.fechaPublicado = new Date();
                } else if (estado.canonical === 'borrador') {
                    values.fechaPublicado = '';
                }
                cb();
            });
        }else */if(values.fechaPublicado){
            values.fechaPublicado = new Date(values.fechaPublicado);
            var canonical = 'borrador';
            if(values.fechaPublicado.getTime() <= new Date().getTime()){
                canonical = 'publicado';
            }
            estado.findOne({ canonical: canonical }).then(function(estado){
                values.estado = estado.id;
                cb();
            });
        }else{
            cb();
        }
    },

    beforeCreate: function(values, cb){
        if(values.fechaPublicado || values.estado){
            this.checkFechaPublicado(values, cb);
        }else{
            cb();
        }
    },

    beforeUpdate: function(values, cb){
        if(values.fechaPublicado || values.estado){
            this.checkFechaPublicado(values, cb);
        }else{
            cb();
        }
    }
};

