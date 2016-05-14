/**
 * Champion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        region: {
            model: 'region'
        },
        // //
        active: {
            type: 'boolean'
        },
        botEnabled: {
            type: 'boolean'
        },
        botMmEnabled: {
            type: 'boolean'
        },
        freeToPlay: {
            type: 'boolean'
        },
        rankedPlayEnabled: {
            type: 'boolean'
        },
        // //
        summonerchampionrank: {
            collection: 'summonerchampionrank',
            via: 'champion'
        },
        banned: {
            collection: 'bannedchampion',
            via: 'champion'
        },
        matches: {
            collection: 'match',
            via: 'champion'
        },
        participants: {
            collection: 'participant',
            via: 'champion'
        },
        tips: {
            collection: 'tip',
            via: 'champion'
        },
        blurb: {
            type: 'string'
        },
        campionId: {
            type: 'integer'
        },
        image: {
            model: 'image'
        },
        info: {
            model: 'championinfo'
        },
        key: {
            type: 'string'
        },
        lore: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        partype: {
            type: 'string'
        },
        passive: {
            collection: 'passive',
            via: 'champion'
        },
        recommended: {
            collection: 'championrecommended',
            via: 'champion'
        },
        skins: {
            collection: 'skin',
            via: 'champion'
        },
        spells: {
            collection: 'championspell',
            via: 'champion'
        },
        title: {
            type: 'string'
        },
        // ===== STATS ===== //
        armor: {
            type: 'float'
        },
        armorperlevel: {
            type: 'float'
        },
        attackdamage: {
            type: 'float'
        },
        attackdamageperlevel: {
            type: 'float'
        },
        attackrange: {
            type: 'float'
        },
        attackspeedoffset: {
            type: 'float'
        },
        attackspeedperlevel: {
            type: 'float'
        },
        crit: {
            type: 'float'
        },
        critperlevel: {
            type: 'float'
        },
        hp: {
            type: 'float'
        },
        hpperlevel: {
            type: 'float'
        },
        hpregen: {
            type: 'float'
        },
        hpregenperlevel: {
            type: 'float'
        },
        mp: {
            type: 'float'
        },
        mpperlevel: {
            type: 'float'
        },
        mpregen: {
            type: 'float'
        },
        mpregenperlevel: {
            type: 'float'
        },
        spellblock: {
            type: 'float'
        },
        spellblockperlevel: {
            type: 'float'
        }
        // ===== STATS ===== //
    }
};

