/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

module.exports.models = {

    /***************************************************************************
     *                                                                          *
     * Your blog's default connection. i.e. the name of one of your blog's        *
     * connections (see `config/connections.js`)                                *
     *                                                                          *
     ***************************************************************************/
    // connection: 'localDiskDb',
    connection: 'mongodbServer',

    /***************************************************************************
     *                                                                          *
     * How and whether Sails will attempt to automatically rebuild the          *
     * tables/collections/etc. in your schema.                                  *
     *                                                                          *
     * See http://sailsjs.org/#!/documentation/concepts/ORM/model-settings.html  *
     *                                                                          *
     ***************************************************************************/
    autoPK: true,
    migrate: 'alter',

    schema: true,

    //migrate: 'save'
    autoCreatedAt: true,
    autoUpdatedAt: true,

    checkNombres: function(values){
        if(values.nombre){
            values.canonical = _.kebabCase(_.deburr(values.nombre));
        }
        if(values.organizacion){
            values.canonicalorganizacion = _.kebabCase(_.deburr(values.organizacion));
        }
        return values;
    },

    beforeValidate: function(values, cb){
        values = this.checkNombres(values);
        cb();
    }

    /*beforeCreate: function(values, cb){
        values = this.checkNombres(values);
        cb();
    },
    beforeUpdate: function(values, cb){
        values = this.checkNombres(values);
        cb();
    }*/
};
