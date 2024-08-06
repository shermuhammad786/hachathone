import pkg from 'jsonwebtoken';
import dotenv from "dotenv";
import { environments } from '../environments/environments.js';
import passport from 'passport';
import { sendMessage } from '../helpers/sendMessage.js';
import { logger } from '..';

dotenv.config();
const { sign } = pkg;


dotenv.config();

export const GenerateToken = ({ data }) => {
  return sign({ result: data }, environments.JWT_SECRET_KEY, { expiresIn: environments.JWT_SECRET_KEY_EXPIRE });
};
export const GenerateRefreshToken = ({ data }) => {
  return sign({ result: data }, environments.JWT_REFRESH_SECRET_KEY, { expiresIn: environments.JWT_REFRESH_SECRET_KEY_EXPIRE });
};


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
};