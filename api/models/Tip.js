/**
 * Tip.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        tipo: {
            type: 'string',
            enum: ['ally', 'enemy', 'tag']

        },
        contenido: {
            type: 'string'
        },
        champion: {
            model: 'champion'
        },
        leveltip: {
            model: 'leveltip'
        }
    }
};

