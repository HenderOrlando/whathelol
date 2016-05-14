/**
 * Frametimelineparticipant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        frametimeline: {
            model: 'frametimeline'
        },
        currentGold: {
            type: 'integer'
        },
        dominionScore: {
            type: 'integer'
        },
        jungleMinionsKilled: {
            type: 'integer'
        },
        level: {
            type: 'integer'
        },
        minionsKilled: {
            type: 'integer'
        },
        participant: {
            model: 'participant'
        },
        position: {
            type: 'json'
        },
        teamScore: {
            type: 'integer'
        },
        totalGold: {
            type: 'integer'
        },
        xp: {
            type: 'integer'
        }
    }
};

