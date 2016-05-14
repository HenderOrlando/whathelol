/**
 * Frametimelineevent.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        frametimeline: {
            model: 'frametimeline'
        },
        ascendedType: {
            type: 'string',
            enum: ['CHAMPION_ASCENDED', 'CLEAR_ASCENDED', 'MINION_ASCENDED']
        },
        assistingParticipant: {
            collection: 'participant',
            via: 'frametimelineevents'
        },
        buildingType: {
            type: 'string',
            enum: ['INHIBITOR_BUILDING', 'TOWER_BUILDING']
        },
        creatorId: {
            type: 'string'
        },
        eventType: {
            type: 'string',
            enum: [
                'ASCENDED_EVENT',
                'BUILDING_KILL',
                'CAPTURE_POINT',
                'CHAMPION_KILL',
                'ELITE_MONSTER_KILL',
                'ITEM_DESTROYED',
                'ITEM_PURCHASED',
                'ITEM_SOLD',
                'ITEM_UNDO',
                'PORO_KING_SUMMON',
                'SKILL_LEVEL_UP',
                'WARD_KILL',
                'WARD_PLACED'
            ]
        },
        itemAfter: {
            model: 'item'
        },
        itemBefore: {
            model: 'item'
        },
        item: {
            model: 'item'
        },
        killer: {
            model: 'summoner'
        },
        laneType: {
            type: 'string',
            enum: ['BOT_LANE', 'MID_LANE', 'TOP_LANE']
        },
        levelUpType: {
            type: 'string',
            enum: ['EVOLVE', 'NORMAL']
        },
        monsterType: {
            type: 'string',
            enum: ['BARON_NASHOR', 'BLUE_GOLEM', 'DRAGON', 'RED_LIZARD', 'RIFTHERALD', 'VILEMAW']
        },
        participant: {
            model: 'participant'
        },
        pointCaptured: {
            type: 'string',
            enum: ['POINT_A', 'POINT_B', 'POINT_C', 'POINT_D', 'POINT_E']
        },
        position: {
            type: 'json'
        },
        skillSlot: {
            type: 'integer'
        },
        team: {
            model: 'team'
        },
        timestamp: {
            type: 'datetime'
        },
        towerType: {
            type: 'string',
            enum: [
                'BASE_TURRET',
                'FOUNTAIN_TURRET',
                'INNER_TURRET',
                'NEXUS_TURRET',
                'OUTER_TURRET',
                'UNDEFINED_TURRET'
            ]
        },
        victim: {
            model: 'summoner'
        },
        wardType: {
            type: 'string',
            enum: [
                'BLUE_TRINKET',
                'SIGHT_WARD',
                'TEEMO_MUSHROOM',
                'UNDEFINED',
                'VISION_WARD',
                'YELLOW_TRINKET',
                'YELLOW_TRINKET_UPGRADE'
            ]
        }
    }
};

