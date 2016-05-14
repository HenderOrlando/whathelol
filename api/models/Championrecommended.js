/**
 * Championrecommended.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        champion:{
            model: 'champion'
        },
        blocks: {
            collection: 'championrecommendedblock',
            via: 'championrecommended'
        },
        championname: {
            type: 'string'
        },
        map: {
            type: 'string'
        },
        mode: {
            type: 'string'
        },
        priority: {
            type: 'boolean'
        },
        title: {
            type: 'string'
        },
        type: {
            type: 'string'
        }
    }
};

