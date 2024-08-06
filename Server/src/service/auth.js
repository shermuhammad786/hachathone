import { bcrypt_compareData, bcrypt_hashingData } from "../helpers/bcrypt";
import { sendMessage } from "../helpers/sendMessage";
import { OTP } from "../models/otp.model";
import User from "../repositories/user";
import { UserModel } from "../models/user.model";
import passport from "passport";
import { RefreshTokenModel } from "../models/refreshToken.model";
import jwt, { verify } from "jsonwebtoken";
import { environments } from "../environments/environments";
import { GenerateToken } from "../middlewares/jwt.middleware";
import { logger } from "../index";
import { SessionHistoryModel } from "../models/session.history";
import { TenantModel } from "../models/tenant.model";




const userModel = new User();
const { findOTPUserByEmail, findUserByEmail, findUserById, findUserByUserName } = userModel;


class Service {



    //SUPER ADMIN
    refresh_super_admin_token = async (token, email) => {

        const { SUPER_ADMIN_ACCESS_TOKEN_KEY, SUPER_ADMIN_ACCESS_TOKEN_EXPIRE, SUPER_ADMIN_REFRESH_TOKEN_KEY } = environments
        const refreshToken = verify(token, SUPER_ADMIN_REFRESH_TOKEN_KEY, (err, decode) => {
            if (err) {
                return sendMessage(false, "login in expire", { err });
            };
            if (decode) {
                const payload = { id: decode.id, email: decode.email };
                const accessToken = jwt.sign(payload, SUPER_ADMIN_ACCESS_TOKEN_KEY, { expiresIn: SUPER_ADMIN_ACCESS_TOKEN_EXPIRE });
                return sendMessage(true, "access token refreshed", { token: accessToken, ...payload });
            };
        });
        return refreshToken
    }

    logIn_super_admin = async (req, res) => {
        const { SUPER_ADMIN_ACCESS_TOKEN_EXPIRE, SUPER_ADMIN_ACCESS_TOKEN_KEY, SUPER_ADMIN_REFRESH_TOKEN_EXPIRE, SUPER_ADMIN_REFRESH_TOKEN_KEY } = environments;
        try {
            await passport.authenticate('local', { session: false }, async (err, user, info) => {
                if (err || !user) {
                    logger.error(`${info.message} ${req.body.email}`)
                    return res.status(403).json({
                        message: info ? info.message + "  ==>>>" : 'Login failed',
                        user: user,
                    });
                }
                const payload = { id: user._id, email: user.email };
                const accessToken = jwt.sign(payload, SUPER_ADMIN_ACCESS_TOKEN_KEY, { expiresIn: SUPER_ADMIN_ACCESS_TOKEN_EXPIRE });
                const refreshToken = jwt.sign(payload, SUPER_ADMIN_REFRESH_TOKEN_KEY, { expiresIn: SUPER_ADMIN_REFRESH_TOKEN_EXPIRE });

                const tokens = new RefreshTokenModel({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: user
                })
                const savedTokens = await tokens.save();

                const expireDate = Number(environments.SESSION_HISTORY_EXPIRE)
                const SessionHistory = new SessionHistoryModel({
                    token: accessToken,
                    userId: user._id,
                    status: "accessed",
                    tokenExpire: Date.now() + expireDate,
                });
                const saveSessionHistory = await SessionHistory.save();


                logger.info(`login successfull ${req.body.email}`)

                return res.status(200).json({
                    status: true,
                    message: "login successfully",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                })

            })(req, res);
        } catch (error) {
            res.send(error)
        }
    }



    changepassword_super_admin = async (req, oldPassword, newPassword, conformPassword, email) => {
        if (!oldPassword || !newPassword || !conformPassword || !email) {
            return (sendMessage(false, "Please fill all the fields", { oldPassword, newPassword, conformPassword, email }))
        }

        if (newPassword !== conformPassword) return (sendMessage(false, "Please correct the confirm password", { oldPassword, newPassword, conformPassword, email }))

        if (newPassword.length < 6) return (sendMessage(false, "Password legth must be 6 characters", { oldPassword, newPassword, conformPassword, email }))
        if (req.user) {
            const { id } = req.user

            const user = await findUserById(id);
            console.log('user: ', user);
            if (!user) {
                return (sendMessage(false, "User not found", { oldPassword, newPassword, conformPassword, email }))
            }
            if (user) {
                const verifyPassword = bcrypt_compareData(oldPassword, user.password)
                console.log('verifyPassword: ', verifyPassword);
                if (verifyPassword.status) {
                    console.log('verifyPassword.status: ', verifyPassword.status);
                    user.password = bcrypt_hashingData(newPassword);
                    await user.save();
                    return (sendMessage(true, "Password has been changed", user))
                } else {
                    return (sendMessage(false, "Incorrect old password", user))
                }
            }
        }
    }

    //TENANT ADMIN AND USERS
    verifyEmail = async (email) => {
        const generateRandomNumber = (min, max) => Math.random() * (max - min) + min;

        if (!email) return sendMessage(false, "All fields are Required")

        const findOtp = await OTP.findOne({ email: email });
        const otpkey = generateRandomNumber(1111, 9999).toFixed();
        const hashOtp = bcrypt_hashingData(otpkey);
        const replacements = {
            code: otpkey,
        };
        if (findOtp) {
            findOtp.otpKey = hashOtp;
            findOtp.expireIn = Date.now() + 30000;
            findOtp.expire = false
            const savedOTP = await findOtp.save();
            return sendMessage(true, "OTP resended", { email: savedOTP.email, id: savedOTP._id, replacements });
        }

        const otp = new OTP({
            email: email,
            otpKey: hashOtp,
            expireIn: Date.now() + 30000
        });

        const savedOTP = await otp.save();
        if (savedOTP) {

            return sendMessage(true, "OTP sent successfully", { email: savedOTP.email, id: savedOTP._id, replacements });

        }
    }


    verifyotp = async (email, otp) => {

        const findUser = await OTP.findOne({ email: email });

        if (findUser && !findUser.used) {

            if (findUser.expire) {
                return sendMessage(false, "OPT has been expired", findUser);
            }

            if (findUser.expireIn < Date.now()) {
                findUser.expire = true;
                await findUser.save();
                return sendMessage(false, "OPT has been expired", findUser);
            }
            const matchOTP = await bcrypt_compareData(otp, findUser.otpKey);

            if (matchOTP.status) {

                return (sendMessage(true, "otp matched Successfully", findUser));

            } else {
                return (sendMessage(false, "otp not matched", findUser))

            }
        } else if (findUser && findUser.used) {
            return (sendMessage(false, "opt is aleady verified", findUser))

        }
        else {
            return (sendMessage(false, "user not defined", { email, otp }))

        }
    }


    signUp = async (name, userName, email, password, otpKey) => {

        if (!name || !userName || !email || !password || !otpKey) return (sendMessage(false, "Please fill all fields"));



        const user = await findUserByEmail(email);
        const OTPUser = await findOTPUserByEmail(email);
        if (OTPUser) {
            const checkOtp = bcrypt_compareData(otpKey, OTPUser?.otpKey);
            if (!checkOtp.status) {
                return (sendMessage(false, "please put the correct otp", OTPUser));
            }
        } else {
            return (sendMessage(false, "Please first verify the email", { name, userName, email, password, otpKey }));
        }
        if (user?.userName === userName) {
            return (sendMessage(false, "UserName is already exists", user));
        }
        if (user) {
            return (sendMessage(false, "Email is already exists", user));
        }
        if (!user && OTPUser) {
            const newUser = new UserModel({ name, userName, email, password, otpKey });
            await newUser.save();

            if (OTPUser?.used === false) {
                OTPUser.used = true;
                await OTPUser.save()
            }
            return (sendMessage(true, "user has bees registered successfully", newUser));
        }
    }


    logIn = async (req, res) => {
        const { JWT_SECRET_KEY, JWT_SECRET_KEY_EXPIRE, JWT_REFRESH_SECRET_KEY, JWT_REFRESH_SECRET_KEY_EXPIRE } = environments;
        try {
            await passport.authenticate('local', { session: false }, async (err, user, info) => {
                if (err || !user) {
                    logger.error(`${info.message} ${req.body.email}`)
                    return res.status(403).json({
                        message: info ? info.message + "  ==>>>" : 'Login failed',
                        user: user,
                    });
                }

                const payload = { id: user.id, email: user.email };
                const findUser = await findUserById(user.id)
                if (!findUser.activeStatus) {
                    return res.status(403).json({ status: false, message: "Plase first click on the link sent to your email to complete you registration" })
                }
                const accessToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_SECRET_KEY_EXPIRE });
                const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET_KEY, { expiresIn: JWT_REFRESH_SECRET_KEY_EXPIRE });

                const tokens = new RefreshTokenModel({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: user
                })
                const savedTokens = await tokens.save();

                const expireDate = Number(environments.SESSION_HISTORY_EXPIRE)
                const SessionHistory = new SessionHistoryModel({
                    token: accessToken,
                    userId: user._id,
                    status: "accessed",
                    tokenExpire: Date.now() + expireDate,
                });
                const saveSessionHistory = await SessionHistory.save();

                logger.info(`login successfull ${req.body.email}`)

                return res.status(200).json({
                    status: true,
                    message: "login successfully",
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })

            })(req, res);
        } catch (error) {
            res.send(error)
        }
    }


    forgotpassword = async (email) => {

        const { JWT_SECRET_KEY, WEB_LINK } = environments
        if (email) {
            const findUser = await findUserByEmail(email);
            if (findUser) {
                const secret = findUser?._id + JWT_SECRET_KEY;


                const token = GenerateToken({ data: secret });
                const link = `${WEB_LINK}/auth/resetpassword/${findUser._id}/${token}`

                const replacements = {
                    code: link,
                };

                const { email, _id } = findUser
                return (sendMessage(true, "Reset password link sent", { id: _id, email, replacements }));

            } else {
                return (sendMessage(false, "User not found", { email }));
            }
        }
    };



    resetpassword = async (newPassword, conformPassword, token, email) => {

        const { JWT_SECRET_KEY } = environments;

        if (!newPassword || !conformPassword || !token || !email) {
            return sendMessage(false, "please fill all the fields", { newPassword, conformPassword, token, email })
        }
        if (newPassword !== conformPassword) {
            return (sendMessage(false, "Please correct conform password", { newPassword, conformPassword, token, email }));
        }
        const result = await jwt.verify(token, JWT_SECRET_KEY, async (error, decode) => {
            if (error) {
                return (sendMessage(false, "Token is not valid", { newPassword, conformPassword, token, email }));
            }
            if (decode) {
                const { result } = decode
                const userid = result.slice(0, result.length - JWT_SECRET_KEY.length)
                const password = bcrypt_hashingData(newPassword);
                const updatePassword = await UserModel.findByIdAndUpdate(userid, { $set: { password: password } }, { new: true });
                if (updatePassword) {
                    return (sendMessage(true, "pasword has been reseted", updatePassword));
                } else {
                    return (sendMessage(false, "some thing went wrong", updatePassword));
                }
            }
        });
        return result
    }

    setpassword = async (req) => {

        const { JWT_SECRET_KEY } = environments;
        const { token } = req.params

        const result = await jwt.verify(token, JWT_SECRET_KEY, async (error, decode) => {
            if (error) {
                return (sendMessage(false, "Token is not valid"));
            }
            if (decode) {
                const { result } = decode
                console.log('result: ', result);
                const userid = result.slice(0, result.length - JWT_SECRET_KEY.length)
                console.log('userid: ', userid);

                const updatePassword = await UserModel.findOneAndUpdate({ _id: Object(userid) }, { $set: { activeStatus: true } }, { new: true });
                console.log('updatePassword: ', updatePassword);

                const updateTenant = await TenantModel.findByIdAndUpdate(updatePassword?.tenantId, { $set: { activeStatus: true } }, { new: true });
                if (updatePassword || updateTenant) {
                    return (sendMessage(true, "pasword has been reseted", updatePassword));
                } else {
                    return (sendMessage(false, "some thing went wrong", updatePassword));
                }
            }
        });
        return result
    }


    changepassword = async (req, oldPassword, newPassword, conformPassword, email) => {
        if (!oldPassword || !newPassword || !conformPassword || !email) {
            return (sendMessage(false, "Please fill all the fields", { oldPassword, newPassword, conformPassword, email }))
        }

        if (newPassword !== conformPassword) return (sendMessage(false, "Please correct the conform password", { oldPassword, newPassword, conformPassword, email }))

        if (newPassword.length < 6) return (sendMessage(false, "Password legth must be 6 characters", { oldPassword, newPassword, conformPassword, email }))
        if (req.user) {
            const { id } = req.user
            const user = await findUserById(id);
            if (!user) {
                return (sendMessage(false, "User not found", { oldPassword, newPassword, conformPassword, email }))
            }
            if (user) {
                const verifyPassword = bcrypt_compareData(oldPassword, user.password)
                if (verifyPassword.status) {
                    user.password = newPassword;
                    await user.save();
                    return (sendMessage(true, "Password has been changed", user))
                } else {
                    return (sendMessage(false, "Incorrect old password", user))
                }
            }
        }
    }


    refresh_token = async (token, email) => {

        const { JWT_REFRESH_SECRET_KEY, JWT_SECRET_KEY, JWT_SECRET_KEY_EXPIRE } = environments
        const refreshToken = verify(token, JWT_REFRESH_SECRET_KEY, (err, decode) => {
            if (err) {
                return sendMessage(false, "login in expire", { email });
            };
            if (decode) {
                const payload = { id: decode.id, email: decode.email };
                const accessToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_SECRET_KEY_EXPIRE });
                return sendMessage(true, "access token refreshed", { token: accessToken, ...payload });
            };
        });
        return refreshToken
    }



}

export default Service;