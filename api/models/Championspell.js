/**
 * Championspell.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        altimages: {
            collection: 'image',
            via: 'spell'
        },
        // cooldown es Arreglo de double
        cooldown: {
            type: 'string'
        },
        cooldownBurn: {
            type: 'string'
        },
        // cost es Arreglo de integer
        cost: {
            type: 'string'
        },
        costBurn: {
            type: 'string'
        },
        costType: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        // effect es Arreglo de Arreglo de double
        effect: {
            type: 'string'
        },
        // effectBurn es Arreglo de string
        effectBurn: {
            type: 'string'
        },
        image: {
            model: 'image'
        },
        key: {
            type: 'string'
        },
        leveltip: {
            model: 'leveltip'
        },
        maxrank: {
            type: 'integer'
        },
        name: {
            type: 'string'
        },
        range: {
            type: 'json'
        },
        rangeBurn: {
            type: 'string'
        },
        resource: {
            type: 'string'
        },
        sanitizedTooltip: {
            type: 'string'
        },
        tooltip: {
            type: 'string'
        },
        vars: {
            collection: 'spellvars',
            via: 'spell'
        }
    }
};

