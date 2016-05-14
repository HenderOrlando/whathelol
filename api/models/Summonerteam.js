/**
 * Summonerteam.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        // sale de playerId
        summoner: {
            model: 'summoner'
        },
        status: {
            type: 'string'
        },
        inviteDate: {
            type: 'datetime'
        },
        joinDate: {
            type: 'datetime'
        }
    }
};

