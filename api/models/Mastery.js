/**
 * Mastery.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        region: {
            model: 'region'
        },
        masterypages: {
            collection: 'masterypage',
            via: 'mastery',
            through: 'masterypagemasteries'
        },
        participantsmastery: {
            collection: 'participantmastery',
            via: 'mastery'
        },
        // description es Array de string
        description: {
            type: 'string'
        },
        masteryId: {
            type: 'string'
        },
        image: {
            model: 'image'
        },
        masteryTree: {
            type: 'string',
            enum: ['Cunning', 'Ferocity', 'Resolve']
        },
        name: {
            type: 'string'
        },
        prerq: {
            type: 'string'
        },
        ranks: {
            type: 'integer'
        },
        // sanitizedDescription es Array de string
        sanitizedDescription: {
            type: 'integer'
        }
    }
};

