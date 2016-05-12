/**
 * Created by hender on 16/04/16.
 */

module.exports = function (req, res, next) {
    OAuth.authenticator.authenticate(
        ['basic', 'oauth2-client-password'],
        { session: false })(req,res,next);
};
