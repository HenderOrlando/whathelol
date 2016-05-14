/**
 * Map.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        region: {
            model: 'region'
        },
        matches: {
            collection: 'match',
            via: 'map'
        },
        items: {
            collection: 'item',
            via: 'maps',
            dominant: true
        },
        runes: {
            collection: 'rune',
            via: 'maps',
            dominant: true
        },
        mapId: {
            type: 'integer'
        },
        image: {
            model: 'image'
        },
        name: {
            type: 'string'
        }
    }
};

