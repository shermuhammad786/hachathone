import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserModel } from '../models/user.model.js';
import { environments } from '../environments/environments.js';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

passport.use(new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }
    const isMatch = await user.login(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});




passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environments.jwtAccessTokenKey
    },
    async (jwt_payload, done) => {

      try {
        const user = await UserModel.findById(jwt_payload.id);
        if (user) {

          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, " ===>>> error", false);
      }
    }
  ))


passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environments.adminAccessTokenKey
    },
    async (jwt_payload, done) => {

      try {
        const user = await UserModel.findById(jwt_payload.id);
        if (user) {

          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, " ===>>> error", false);
      }
    }
  ))






export default passport;
