/**
 * Matchteam.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        team: {
            model: 'team'
        },
        // ===== MatchHistorySummary ===== //
        assists: {
            type: 'integer'
        },
        date: {
            type: 'datetime'
        },
        deaths: {
            type: 'integer'
        },
        gameId: {
            type: 'integer'
        },
        gameMode: {
            type: 'integer'
        },
        invalid: {
            type: 'boolean'
        },
        kills: {
            type: 'integer'
        },
        map: {
            model: 'map'
        },
        opposingTeamKills: {
            type: 'integer'
        },
        opposingTeamName: {
            type: 'integer'
        },
        win: {
            type: 'integer'
        }
        // ===== MatchHistorySummary ===== //
    }
};

