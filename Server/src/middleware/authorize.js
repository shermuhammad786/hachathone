export const jwtAuth = (req, res, next) => {
    const { email } = req.body
    passport.authenticate("jwt", { session: false }, function (err, user, info) {
        if (err) {
            logger.error(`token is expired ${email}`)
            return next(err);
        }
        if (!user) {
            logger.info(`token is not valid ${info}`)
            return res.status(401).json(sendMessage(false, "token is not valid ==>>> ", info));
        }

        req.user = user;
        next();
    })(req, res, next);
}