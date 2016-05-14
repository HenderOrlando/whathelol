/**
 * Team.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        createDate: {
            type: 'datetime'
        },
        fullId: {
            type: 'string'
        },
        lastGameDate: {
            type: 'datetime'
        },
        lastJoinDate: {
            type: 'datetime'
        },
        lastJoinedRankedTeamQueueDate: {
            type: 'datetime'
        },
        matchHistory: {
            collection: 'matchteamsummary',
            via: 'team'
        },
        matches: {
            collection: 'matchteam',
            via: 'team'
        },
        modifyDate: {
            type: 'datetime'
        },
        name: {
            type: 'string'
        },
        // de Roster
        ownerId: {
            type: integer
        },
        memberList: {
            collection: 'summonerTeam',
            via: 'team'
        },
        // de Roster
        secondLastJoinDate: {
            type: 'datetime'
        },
        tag: {
            type: 'string'
        },
        teamStatDetails: {
            collection: 'teamDetails'
        },
        thirdLastJoinDate: {
            type: 'datetime'
        }
    }
};

