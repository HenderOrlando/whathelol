/**
 * Frametimeline.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        match: {
            model: 'match'
        },
        events: {
            collection: 'frametimelineevent',
            via: 'frametimeline'
        },
        participants: {
            collection: 'frametimelineparticipant',
            via: 'frametimeline'
        },
        timestamp: {
            type: 'datetime'
        }
    }
};

