/**title
 * Lenguage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        region: {
            model: 'region'
        },
        // key es la Key de map
        key: {
            type: 'string'
        },
        // value es el valor de map
        value: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        version: {
            type: 'string'
        }
    }
};

