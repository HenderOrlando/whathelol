/**
 * Spellvars.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        championspell: {
            model: 'championspell'
        },
        summonerspell: {
            model: 'summonerspell'
        },
        // coeff es Arreglo de double
        coeff: {
            type: 'string'
        },
        dyn: {
            type: 'string'
        },
        key: {
            type: 'string'
        },
        link: {
            type: 'string'
        },
        ranksWith: {
            type: 'string'
        }
    }
};

