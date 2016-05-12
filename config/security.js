/**
 * Created by hender on 16/04/16.
 */
module.exports.security = {
    oauth : {
        version : '2.0',
        token : {
            length: 32,
            expiration: 3600
        }
    },
    admin: {
        email: {
            host:       'hp88.hostpapa.com',
            port:       465,
            address:    'ventasymercadeo@solucionescucuta.com',
            password:   'f+Jr~HFW$^Am'
        }

    },
    server: {
        url: 'http://localhost:1337'
    }
};
