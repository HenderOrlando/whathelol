/**
 * Passive.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        champions: {
            collection: 'champion',
            via: 'passive'
        },
        description: {
            type: 'string'
        },
        image: {
            model: 'image'
        },
        name: {
            type: 'string'
        },
        sanitizedDescription: {
            type: 'string'
        }
    }
};

