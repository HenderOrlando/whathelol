/**
 * TimelineData.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        // Valor por minuto de 10 a 20 min
        tenToTwenty: {
            type: 'float'
        },
        // Valor por minuto de 30 a fin min
        thirtyToEnd: {
            type: 'float'
        },
        // Valor por minuto de 20 a 30 min
        twentyToThirty: {
            type: 'float'
        },
        // Valor por minuto de 0 a 10 min
        zeroToTen: {
            type: 'float'
        }
    }
};

