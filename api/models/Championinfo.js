/**
 * Championinfo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        champion: {
            collection: 'champion',
            via: 'info'
        },
        attack: {
            type: 'integer'
        },
        defense: {
            type: 'integer'
        },
        difficulty: {
            type: 'integer'
        },
        magic: {
            type: 'integer'
        }
    }
};

