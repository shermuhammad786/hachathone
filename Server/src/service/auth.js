import { bcryptCompareData, bcryptHashingData } from "../helpers/bcrypt.js";
import { sendMessage } from "../helpers/sendMessage.js";
import { OTP } from "../models/otp.model.js";
import User from "../repositories/user.js";
import { UserModel } from "../models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { environments } from "../environments/environments.js";
import { GenerateToken } from "../middlewares/jwt.middleware.js";
import { logger } from "../index.js";
import { RefreshTokenModel } from "../models/refreshToken.model.js";

const { verify } = jwt


const userModel = new User();
const { OTPUserByEmail, UserByEmail, UserById, UserByUserName } = userModel;


class Service {



    //SUPER ADMIN
    refreshSuperAdminTokenService = async (token, email) => {

        const { adminAccessTokenKey, adminAccessTokenExpireTime, adminRefreshTokenKey } = environments
        const refreshToken = verify(token, adminRefreshTokenKey, (err, decode) => {
            if (err) {
                return sendMessage(false, "login in expire", { err });
            };
            if (decode) {
                const payload = { id: decode.id, email: decode.email };
                const accessToken = jwt.sign(payload, adminAccessTokenKey, { expiresIn: adminAccessTokenExpireTime });
                return sendMessage(true, "access token refreshed", { token: accessToken, ...payload });
            };
        });
        return refreshToken
    }

    logInSuperAdminService = async (req, res) => {
        const { adminAccessTokenExpireTime, adminAccessTokenKey, adminRefreshTokenExpireTime, adminRefreshTokenKey } = environments;
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
                const accessToken = jwt.sign(payload, adminAccessTokenKey, { expiresIn: adminAccessTokenExpireTime });
                const refreshToken = jwt.sign(payload, adminRefreshTokenKey, { expiresIn: adminRefreshTokenExpireTime });

                const tokens = new RefreshTokenModel({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: user
                })
                const savedTokens = await tokens.save();

                const expireDate = (environments.sessionHistoryExpireTime)
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

    changepasswordSuperAdminService = async (req, oldPassword, newPassword, conformPassword, email) => {
        if (!oldPassword || !newPassword || !conformPassword || !email) {
            return (sendMessage(false, "Please fill all the fields", { oldPassword, newPassword, conformPassword, email }))
        }

        if (newPassword !== conformPassword) return (sendMessage(false, "Please correct the confirm password", { oldPassword, newPassword, conformPassword, email }))

        if (newPassword.length < 6) return (sendMessage(false, "Password legth must be 6 characters", { oldPassword, newPassword, conformPassword, email }))
        if (req.user) {
            const { id } = req.user

            const user = await UserById(id);

            if (!user) {
                return (sendMessage(false, "User not found", { oldPassword, newPassword, conformPassword, email }))
            }
            if (user) {
                const verifyPassword = bcryptCompareData(oldPassword, user.password)

                if (verifyPassword.status) {

                    user.password = bcryptHashingData(newPassword);
                    await user.save();
                    return (sendMessage(true, "Password has been changed", user))
                } else {
                    return (sendMessage(false, "Incorrect old password", user))
                }
            }
        }
    }


    //TENANT ADMIN AND USERS
    verifyEmailService = async (email) => {
        const generateRandom = (min, max) => Math.random() * (max - min) + min;

        if (!email) return sendMessage(false, "All fields are Required")

        const Otp = await OTP.findOne({ email: email });
        const otpkey = generateRandom(1111, 9999).toFixed();
        const hashOtp = bcryptHashingData(otpkey);
        const replacements = {
            code: otpkey,
        };
        if (Otp) {
            Otp.otpKey = hashOtp;
            Otp.expireIn = Date.now() + 30000;
            Otp.expire = false
            const savedOTP = await Otp.save();
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


    verifyotpService = async (email, otp) => {

        const User = await OTP.findOne({ email: email });

        if (User && !User.used) {

            if (User.expire) {
                return sendMessage(false, "OPT has been expired", User);
            }

            if (User.expireIn < Date.now()) {
                User.expire = true;
                await User.save();
                return sendMessage(false, "OPT has been expired", User);
            }
            const matchOTP = await bcryptCompareData(otp, User.otpKey);

            if (matchOTP.status) {

                return (sendMessage(true, "otp matched Successfully", User));

            } else {
                return (sendMessage(false, "otp not matched", User))

            }
        } else if (User && User.used) {
            return (sendMessage(false, "opt is aleady verified", User))

        }
        else {
            return (sendMessage(false, "user not defined", { email, otp }))

        }
    }


    signUpService = async (name, userName, email, password, otpKey) => {

        if (!name || !userName || !email || !password || !otpKey) return (sendMessage(false, "Please fill all fields"));



        const user = await UserByEmail(email);
        const OTPUser = await OTPUserByEmail(email);
        if (OTPUser) {
            const checkOtp = bcryptCompareData(otpKey, OTPUser.otpKey);
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


    logInService = async (req, res) => {
        const { jwtAccessTokenKey, jwtAccessTokenExpireTime, jwtRefreshTokenKey, jwtRefreshTokenExpireTime } = environments;
        console.log('jwtAccessTokenKey: ', jwtAccessTokenKey);
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
                const User = await UserById(user.id)
                if (!User.activeStatus) {
                    return res.status(403).json({ status: false, message: "Plase first click on the link sent to your email to complete you registration" })
                }
                const accessToken = jwt.sign(payload, jwtAccessTokenKey, { expiresIn: jwtAccessTokenExpireTime });
                const refreshToken = jwt.sign(payload, jwtRefreshTokenKey, { expiresIn: jwtRefreshTokenExpireTime });

                const tokens = new RefreshTokenModel({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: user
                })
                const savedTokens = await tokens.save();

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


    forgotpasswordService = async (email) => {

        const { jwtAccessTokenKey, baseUrl } = environments
        if (email) {
            const User = await UserByEmail(email);
            if (User) {
                const secret = User?._id + jwtAccessTokenKey;


                const token = GenerateToken({ data: secret });
                const link = `${baseUrl}/api/auth/resetpassword/${User._id}/${token}`

                const replacements = {
                    code: link,
                };

                const { email, _id } = User
                return (sendMessage(true, "Reset password link sent", { id: _id, email, replacements }));

            } else {
                return (sendMessage(false, "User not found", { email }));
            }
        }
    };



    resetpasswordService = async (newPassword, conformPassword, token, email) => {

        const { jwtAccessTokenKey } = environments;

        if (!newPassword || !conformPassword || !token || !email) {
            return sendMessage(false, "please fill all the fields", { newPassword, conformPassword, token, email })
        }
        if (newPassword !== conformPassword) {
            return (sendMessage(false, "Please correct conform password", { newPassword, conformPassword, token, email }));
        }
        const result = await jwt.verify(token, jwtAccessTokenKey, async (error, decode) => {
            if (error) {
                return (sendMessage(false, "Token is not valid", { newPassword, conformPassword, token, email }));
            }
            if (decode) {
                const { result } = decode
                const userid = result.slice(0, result.length - jwtAccessTokenKey.length)
                const password = bcryptHashingData(newPassword);
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

    setpasswordService = async (req) => {

        const { jwtAccessTokenKey } = environments;
        const { token } = req.params

        const result = await jwt.verify(token, jwtAccessTokenKey, async (error, decode) => {
            if (error) {
                return (sendMessage(false, "Token is not valid"));
            }
            if (decode) {
                const { result } = decode

                const userid = result.slice(0, result.length - jwtAccessTokenKey.length)


                const updatePassword = await UserModel.findOneAndUpdate({ _id: Object(userid) }, { $set: { activeStatus: true } }, { new: true });


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


    changepasswordService = async (req, oldPassword, newPassword, conformPassword, email) => {
        if (!oldPassword || !newPassword || !conformPassword || !email) {
            return (sendMessage(false, "Please fill all the fields", { oldPassword, newPassword, conformPassword, email }))
        }

        if (newPassword !== conformPassword) return (sendMessage(false, "Please correct the conform password", { oldPassword, newPassword, conformPassword, email }))

        if (newPassword.length < 6) return (sendMessage(false, "Password legth must be 6 characters", { oldPassword, newPassword, conformPassword, email }))
        if (req.user) {
            const { id } = req.user
            const user = await UserById(id);
            if (!user) {
                return (sendMessage(false, "User not found", { oldPassword, newPassword, conformPassword, email }))
            }
            if (user) {
                const verifyPassword = bcryptCompareData(oldPassword, user.password)
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


    refreshTokenService = async (token, email) => {

        const { jwtRefreshTokenKey, jwtAccessTokenKey, jwtAccessTokenExpireTime } = environments
        const refreshToken = verify(token, jwtRefreshTokenKey, (err, decode) => {
            if (err) {
                return sendMessage(false, "login in expire", { email });
            };
            if (decode) {
                const payload = { id: decode.id, email: decode.email };
                const accessToken = jwt.sign(payload, jwtAccessTokenKey, { expiresIn: jwtAccessTokenExpireTime });
                return sendMessage(true, "access token refreshed", { token: accessToken, ...payload });
            };
        });
        return refreshToken
    }



}

export default Service;