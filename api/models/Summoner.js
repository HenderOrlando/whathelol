/**
 * Summoner.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        region: {
            model: 'region'
        },
        masteries: {
            collection: 'masterypage',
            via: 'summoner'
        },
        runes: {
            collection: 'runepage',
            via: 'summoner'
        },
        summonerchampionrank: {
            collection: 'summonerchampionrank',
            via: 'summoner'
        },
        summonersummary: {
            collection: 'summonersummary',
            via: 'summoner'
        },
        matches: {
            collection: 'match',
            via: 'summoner'
        },
        summonerId: {
            type: 'integer'
        },
        name: {
            type: 'string'
        },
        profileIconId: {
            type: 'integer',
            unique: true
        },
        revisiondDate: {
            type: 'datetime',
            unique: true
        },
        summonerLevel: {
            type: 'integer',
            unique: true
        },
        killers: {
            collection: 'frametimelineevents',
            via: 'killer'
        },
        victims: {
            collection: 'frametimelineevents',
            via: 'victim'
        },
        // RPC
        score: {
            type: 'integer'
        }
        /*,
        masteries_lol: {
            type: 'json'
        },
        runes_lol: {
            type: 'json'
        },
        ranked_lol: {
            type: 'json'
        },
        summary_lol: {
            type: 'json'
        },
        matchlist_lol: {
            type: 'json'
        },
        match_lol: {
            type: 'json'
        }*/
    }
};

