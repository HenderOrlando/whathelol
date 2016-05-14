/**
 * Region.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        champions: {
            collection: 'champion',
            via: 'region'
        },
        hostname: {
            type: 'string'
        },
        items: {
            collection: 'item',
            via: 'region'
        },
        languages: {
            collection: 'language',
            via: 'region'
        },
        locales: {
            collection: 'locale',
            via: 'region'
        },
        maps: {
            collection: 'map',
            via: 'region'
        },
        masteries: {
            collection: 'mastery',
            via: 'region'
        },
        name: {
            type: 'string'
        },
        // Platform de la región
        platform: {
            type: 'string'
        },
        region_tag: {
            type: 'string'
        },
        runes: {
            collection: 'rune',
            via: 'region'
        },
        /*services: {
            collection: 'service'
        },*/
        slug: {
            type: 'string'
        },
        summoners: {
            collection: 'summoner',
            via: 'region'
        },
        summonerspells: {
            collection: 'summonerspell',
            via: 'region'
        }
    }
};

