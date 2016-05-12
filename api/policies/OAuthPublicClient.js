/**
 * Created by hender on 16/04/16.
 */

module.exports = function (req, res, next) {
    OAuth.authenticator.authenticate(
        ['oauth2-public-client'],
        { session: false })(req,res,next);
};
