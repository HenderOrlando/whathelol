/**
 * Matchteam.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        match: {
            model: 'match'
        },
        team: {
            model: 'team'
        },
        bans: {
            collection: 'bannedchampion',
            via: 'matchteam'
        },
        baronKills: {
            type: 'integer'
        },
        dominionVictoryScore: {
            type: 'integer'
        },
        dragonKills: {
            type: 'integer'
        },
        inhibitorKills: {
            type: 'integer'
        },
        riftHeraldKills: {
            type: 'integer'
        },
        towerKills: {
            type: 'integer'
        },
        vilemawKills: {
            type: 'integer'
        },
        winner: {
            type: 'integer'
        },
        firstBaron: {
            type: 'boolean'
        },
        firstBlood: {
            type: 'boolean'
        },
        firstDragon: {
            type: 'boolean'
        },
        firstInhibitor: {
            type: 'boolean'
        },
        firstRiftHerald: {
            type: 'boolean'
        },
        firstTower: {
            type: 'boolean'
        }
    }
};

