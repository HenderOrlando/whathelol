/**
 * Participant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        match: {
            model: 'match'
        },
        champion: {
            model: 'champion'
        },
        highestAchievedSeasonTier: {
            type: 'string',
            enum: [
                'CHALLENGER',
                'MASTER',
                'DIAMOND',
                'PLATINUM',
                'GOLD',
                'SILVER',
                'BRONZE',
                'UNRANKED'
            ]
        },
        masteries: {
            collection: 'participantmastery',
            via: 'participant'
        },
        runes: {
            collection: 'participantrune',
            via: 'participant'
        },
        summoner: {
            model: 'summoner'
        },
        // Por implementar spells
        spells: {
            collection: 'spell',
            via: 'participant',
            through: 'participantspell'
        },
        team: {
            model: 'team'
        },
        frametimelineeventsassiting: {
            collection: 'participant',
            via: 'assistingParticipant',
            dominant: true
        },
        frametimelineevents: {
            collection: 'participant',
            via: 'participant'
        },
        // ===== STATS ===== //
        assists: {
            type: 'integer'
        },
        champLevel: {
            type: 'integer'
        },
        combatPlayerScore: {
            type: 'integer'
        },
        deaths: {
            type: 'integer'
        },
        doubleKills: {
            type: 'integer'
        },
        firstBloodAssist: {
            type: 'boolean'
        },
        firstBloodKill: {
            type: 'boolean'
        },
        firstInhibitorAssist: {
            type: 'boolean'
        },
        firstInhibitorKill: {
            type: 'boolean'
        },
        firstTowerAssist: {
            type: 'boolean'
        },
        firstTowerKill: {
            type: 'boolean'
        },
        goldEarned: {
            type: 'integer'
        },
        goldSpent: {
            type: 'integer'
        },
        inhibitorKills: {
            type: 'integer'
        },
        items: {
            collection: 'item',
            via: 'participants'
        },/*
        item1: {
            type: 'integer'
        },
        item2: {
            type: 'integer'
        },
        item3: {
            type: 'integer'
        },
        item4: {
            type: 'integer'
        },
        item5: {
            type: 'integer'
        },
        item6: {
            type: 'integer'
        },*/
        killingSprees: {
            type: 'integer'
        },
        kills: {
            type: 'integer'
        },
        largestCriticalStrike: {
            type: 'integer'
        },
        largestKillingSpree: {
            type: 'integer'
        },
        largestMultiKill: {
            type: 'integer'
        },
        magicDamageDealt: {
            type: 'integer'
        },
        magicDamageDealtToChampions: {
            type: 'integer'
        },
        magicDamageTaken: {
            type: 'integer'
        },
        minionsKilled: {
            type: 'integer'
        },
        neutralMinionsKilled: {
            type: 'integer'
        },
        neutralMinionsKilledEnemyJungle: {
            type: 'integer'
        },
        neutralMinionsKilledTeamJungle: {
            type: 'integer'
        },
        nodeCapture: {
            type: 'integer'
        },
        nodeCaptureAssist: {
            type: 'integer'
        },
        nodeNeutralize: {
            type: 'integer'
        },
        nodeNeutralizeAssist: {
            type: 'integer'
        },
        objectivePlayerScore: {
            type: 'integer'
        },
        pentaKills: {
            type: 'integer'
        },
        physicalDamageDealt: {
            type: 'integer'
        },
        physicalDamageDealtToChampions: {
            type: 'integer'
        },
        physicalDamageTaken: {
            type: 'integer'
        },
        quadraKills: {
            type: 'integer'
        },
        sightWardsBoughtInGame: {
            type: 'integer'
        },
        teamObjective: {
            type: 'integer'
        },
        totalDamageDealt: {
            type: 'integer'
        },
        totalDamageDealtToChampions: {
            type: 'integer'
        },
        totalDamageTaken: {
            type: 'integer'
        },
        totalHeal: {
            type: 'integer'
        },
        totalPlayerScore: {
            type: 'integer'
        },
        totalScoreRank: {
            type: 'integer'
        },
        totalTimeCrowdControlDealt: {
            type: 'integer'
        },
        totalUnitsHealed: {
            type: 'integer'
        },
        towerKills: {
            type: 'integer'
        },
        tripleKills: {
            type: 'integer'
        },
        trueDamageDealt: {
            type: 'integer'
        },
        trueDamageDealtToChampions: {
            type: 'integer'
        },
        trueDamageTaken: {
            type: 'integer'
        },
        unrealKills: {
            type: 'integer'
        },
        visionWardsBoughtInGame: {
            type: 'integer'
        },
        wardsKilled: {
            type: 'integer'
        },
        wardsPlaced: {
            type: 'integer'
        },
        winner: {
            type: 'integer'
        },
        // ===== STATS ===== //
        // ===== TIMELINE ===== //
        ancientGolemAssistsPerMinCounts: {
            model: 'timelinedata'
        },
        ancientGolemKillsPerMinCounts: {
            model: 'timelinedata'
        },
        assistedLaneDeathsPerMinDeltas: {
            model: 'timelinedata'
        },
        assistedLaneKillsPerMinDeltas: {
            model: 'timelinedata'
        },
        baronAssistsPerMinCounts: {
            model: 'timelinedata'
        },
        baronKillsPerMinCounts: {
            model: 'timelinedata'
        },
        creepsPerMinDeltas: {
            model: 'timelinedata'
        },
        csDiffPerMinDeltas: {
            model: 'timelinedata'
        },
        damageTakenDiffPerMinDeltas: {
            model: 'timelinedata'
        },
        damageTakenPerMinDeltas: {
            model: 'timelinedata'
        },
        dragonAssistsPerMinCounts: {
            model: 'timelinedata'
        },
        dragonKillsPerMinCounts: {
            model: 'timelinedata'
        },
        elderLizardAssistsPerMinCounts: {
            model: 'timelinedata'
        },
        elderLizardKillsPerMinCounts: {
            model: 'timelinedata'
        },
        goldPerMinDeltas: {
            model: 'timelinedata'
        },
        inhibitorAssistsPerMinCounts: {
            model: 'timelinedata'
        },
        inhibitorKillsPerMinCounts: {
            model: 'timelinedata'
        },
        lane: {
            type: 'string',
            enum: [
                'MID',
                'MIDDLE',
                'TOP',
                'JUNGLE',
                'BOT',
                'BOTTOM'
            ]
        },
        role: {
            type: 'string',
            enum: [
                'DUO',
                'NONE',
                'SOLO',
                'DUO_CARRY',
                'DUO_SUPPORT'
            ]
        },
        towerAssistsPerMinCounts: {
            model: 'timelinedata'
        },
        towerKillsPerMinCounts: {
            model: 'timelinedata'
        },
        towerKillsPerMinDeltas: {
            model: 'timelinedata'
        },
        vilemawAssistsPerMinCounts: {
            model: 'timelinedata'
        },
        vilemawKillsPerMinCounts: {
            model: 'timelinedata'
        },
        wardsPerMinDeltas: {
            model: 'timelinedata'
        },
        xpDiffPerMinDeltas: {
            model: 'timelinedata'
        },
        xpPerMinDeltas: {
            model: 'timelinedata'
        }
        // ===== TIMELINE ===== //
    }
};

