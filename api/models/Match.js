/**
 * Match.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        summoner: {
            model: 'summoner'
        },
        champion: {
            model: 'champion'
        },
        timestamp: {
            type: 'datetime'
        },
        matchId: {
            type: 'integer',
            unique: true
        },
        season: {
            type: 'string',
            enum: ['SEASON2016', 'SEASON2015', 'SEASON2014', 'SEASON3']
        },
        platformId: {
            model: 'region'
        },
        // ===== Match List ===== //
        role: {
            type: 'string',
            enum: ['DUO', 'NONE', 'SOLO', 'DUO_CARRY', 'DUO_SUPPORT']
        },
        queue: {
            type: 'string',
            enum: [
                'TEAM_BUILDER_DRAFT_RANKED_5x5',
                'RANKED_SOLO_5x5',
                'RANKED_TEAM_3x3',
                'RANKED_TEAM_5x5'
            ]
        },
        lane: {
            type: 'string',
            enum: ['MID', 'MIDDLE', 'TOP', 'JUNGLE', 'BOT', 'BOTTOM']
        },
        // ===== Match List ===== //
        // ===== Match ===== //
        map: {
            model: 'map'
        },
        matchCreation: {
            type: 'datetime'
        },
        matchDuration: {
            type: 'datetime'
        },
        matchMode: {
            type: 'string',
            enum: [
                'CLASSIC',
                'ODIN',
                'ARAM',
                'TUTORIAL',
                'ONEFORALL',
                'ASCENSION',
                'FIRSTBLOOD',
                'KINGPORO'
            ]
        },
        matchType: {
            type: 'string',
            enum: ['CUSTOM_GAME', 'MATCHED_GAME', 'TUTORIAL_GAME']
        },
        matchVersion: {
            type: 'string'
        },
        queueType: {
            type: 'string',
            enum: [
                'CUSTOM',
                'NORMAL_5x5_BLIND',
                'RANKED_SOLO_5x5',
                'RANKED_PREMADE_5x5',
                'BOT_5x5, NORMAL_3x3',
                'RANKED_PREMADE_3x3',
                'NORMAL_5x5_DRAFT',
                'ODIN_5x5_BLIND',
                'ODIN_5x5_DRAFT',
                'BOT_ODIN_5x5',
                'BOT_5x5_INTRO',
                'BOT_5x5_BEGINNER',
                'BOT_5x5_INTERMEDIATE',
                'RANKED_TEAM_3x3',
                'RANKED_TEAM_5x5',
                'BOT_TT_3x3',
                'GROUP_FINDER_5x5',
                'ARAM_5x5',
                'ONEFORALL_5x5',
                'FIRSTBLOOD_1x1',
                'FIRSTBLOOD_2x2',
                'SR_6x6',
                'URF_5x5',
                'ONEFORALL_MIRRORMODE_5x5',
                'BOT_URF_5x5',
                'NIGHTMARE_BOT_5x5_RANK1',
                'NIGHTMARE_BOT_5x5_RANK2',
                'NIGHTMARE_BOT_5x5_RANK5',
                'ASCENSION_5x5',
                'HEXAKILL',
                'BILGEWATER_ARAM_5x5',
                'KING_PORO_5x5',
                'COUNTER_PICK',
                'BILGEWATER_5x5',
                'TEAM_BUILDER_DRAFT_UNRANKED_5x5',
                'TEAM_BUILDER_DRAFT_RANKED_5x5'
            ]
        },
        participants: {
            collection: 'participant',
            via: 'match'
        },
        // Player de ParticipantIdentity
        players: {
            collection: 'player',
            via: 'match'
        },
        // ===== TIMELINE ===== //
        frameInterval: {
            type: 'integer'
        },
        frames: {
            colelction: 'frametimeline',
            via: 'match'
        },
        // ===== TIMELINE ===== //
        teams: {
            collection: 'matchteam',
            via: 'match'
        }
        // ===== Match ===== //
    }
};

