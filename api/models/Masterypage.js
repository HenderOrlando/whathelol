/**
 * Masterypage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        id_lol: {
            type: 'integer'
        },
        name_lol: {
            type: 'string'
        },
        current_lol: {
            type: 'boolean'
        },
        summoner: {
            model: 'summoner'
        },
        masteries: {
            collection: 'masterypagemasteries',
            via: 'masterypage'
        }
    }
};

