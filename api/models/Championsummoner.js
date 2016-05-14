/**
 * Championsummoner.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        champion: {
            model: 'champion'
        },
        summoner: {
            model: 'summoner'
        },
        championLevel: {
            type: 'integer'
        },
        championPoints: {
            type: 'integer'
        },
        championPointsSinceLastLevel: {
            type: 'integer'
        },
        championPointsUntilNextLevel: {
            type: 'integer'
        },
        chestGranted: {
            type: 'boolean'
        },
        highestGrade: {
            type: 'integer'
        },
        lastPlayTime: {
            type: 'datetime'
        }
    }
};

