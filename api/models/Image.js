/**
 * Image.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        champions: {
            collection: 'champion',
            via: 'image'
        },
        passives: {
            collection: 'passive',
            via: 'image'
        },
        spells: {
            collection: 'championspell',
            via: 'image'
        },
        altspells: {
            collection: 'championspell',
            via: 'altimages'
        },
        items: {
            collection: 'item',
            via: 'images'
        },
        full: {
            type: 'string'
        },
        group: {
            type: 'string'
        },
        h: {
            type: 'integer'
        },
        sprite: {
            type: 'string'
        },
        w: {
            type: 'integer'
        },
        x: {
            type: 'integer'
        },
        y: {
            type: 'integer'
        }
    }
};

