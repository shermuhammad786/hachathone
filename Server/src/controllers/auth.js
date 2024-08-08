import { sendMessage } from "../helpers/sendMessage.js";
import Service from "../service/auth.js";
import { logger } from "../index.js";
import { sendEmail } from "../helpers/sendEmail.js";

const userService = new Service();
const { verifyEmailService, verifyotpService, signUpService, logInService, forgotpasswordService, resetpasswordService, changepasswordService, refreshTokenService, refreshSuperAdminTokenService, logInSuperAdminService, changepasswordSuperAdminService, setpasswordService } = userService



// TENANT ADMIN AND USERS
export const emailVerify = async (req, res, next) => {

    try {
        const { email } = req.body;
        const verify = await verifyEmailService(email);
        const template = "signup-verify";
        if (verify?.status) {
            const { replacements, email, id } = verify?.data;

            logger.info(`${verify.message} ${email}`);

            res.status(200).json(sendMessage(true, verify.message, { email, id }));

            await sendEmail({ email, subject: "OTP email verify", template, replacements });
        } else {
            logger.error(`${verify?.message} ${email}`);
            return res.status(403).json(verify);

        }
    } catch (error) {
        logger.error("Internal server error", { body: error });
        res.status(500).json(sendMessage(false, "Internal server error"))
    }

}

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const verify = await verifyotpService(email, otp);
        if (verify.status) {
            logger.info(`${verify.message} ${verify.data.email}`)
            return res.status(200).json(verify);
        } else {
            logger.info(`${verify?.message} ${verify?.data.email}`)
            return res.status(403).json(verify);
        }
    } catch (error) {
        logger.error("Internal server error", { body: error })
        res.status(500).json(sendMessage(false, "Internal server error"))
    }
}

export const signup = async (req, res, next) => {
    try {
        const { name, userName, email, password, otpKey } = req.body
        const user = await signUpService(name, userName, email, password, otpKey)
        if (user?.status) {
            logger.info(`${user?.message} ${user?.data.email}`)
            return res.status(200).json(user);
        } else {
            logger.error(`${user?.message} ${user?.data.email}`)
            return res.status(200).json(sendMessage(false, user?.message, user?.data))
        }

    } catch (error) {
        logger.info("Internal server error", { body: error })
        res.status(500).json(sendMessage(false, "Internal server error"))
    }
};

export const login = async (req, res, next) => {

    try {
        const { email, password } = req.body
        await logInService(req, res)

    } catch (error) {
        res.status(500).json(sendMessage(false, "Internal server error"))
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const forgot = await forgotpasswordService(email);
        const template = "forget-password";

        if (forgot?.status) {
            const { email, id, replacements } = forgot?.data

            logger.info(`${forgot.message} ${email}`)

            res.status(200).json(sendMessage(true, forgot.message, { email, id }));

            await sendEmail({ email, subject: "Password reset", template, replacements });

            return;
        } else {
            logger.error(`${forgot?.message} ${email}`)
            return res.status(403).json(forgot)
        }
    } catch (error) {
        logger.error("internal server error", { body: error })
        res.status(500).json(sendMessage(false, "Internal server error"))
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const { newPassword, conformPassword, token, email } = req.body;
        const reset = await resetpasswordService(newPassword, conformPassword, token, email);
        if (reset?.status) {
            logger.info(`${reset.message} ${reset.data.email}`);
            return res.status(200).json(reset)
        } else {
            logger.error(`${reset.message} ${reset.data.email}`);
            return res.status(403).json(reset);
        }

    } catch (error) {
        logger.error("Internal server error", { body: error });
        res.status(500).json(sendMessage(false, "Internal server error", error));
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const { oldPassword, newPassword, conformPassword, email } = req.body;
        const change = await changepasswordService(req, oldPassword, newPassword, conformPassword, email)
        if (change?.status) {
            logger.info(`${change.message} ${change.data.email}`)
            return res.status(200).json(change)
        } else {
            logger.error(`${change?.message} ${change?.data.email}`)
            return res.status(403).json(change)
        }
    } catch (error) {
        return res.status(500).json(sendMessage(false, "Interanal server error", null))
    }

}

export const refreshToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { email } = req.body
        const refresh = await refreshTokenService(token, email)
        if (refresh.status) {
            logger.info(`${refresh.message} ${refresh?.data?.email}`)
            res.status(200).json(sendMessage(true, refresh.message, refresh.data))
        } else {
            logger.error(`${refresh?.message} ${refresh?.data.email}`)
            res.status(403).json(sendMessage(false, refresh.message, refresh.data))
        }
    } catch (error) {
        return res.send(sendMessage(false, "Internal server error", error))
    }
}

export const setPassword = async (req, res, next) => {
    try {
        const reset = await setpasswordService(req);

        if (reset?.status) {
            logger.info(`${reset.message} ${reset.data.email}`);
            return res.status(200).json(reset)
        } else {
            logger.error(`${reset.message} ${reset.data.email}`);
            return res.status(403).json(reset);
        }

    } catch (error) {
        logger.error("Internal server error", error);
        res.status(500).json(sendMessage(false, "Internal server error", error));
    }
}


//SUPER ADMIN
export const refreshSuperAdminToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { email } = req.body
        const refresh = await refreshSuperAdminTokenService(token, email)
        if (refresh.status) {
            logger.info(`${refresh.message} ${refresh?.data?.email}`)
            res.status(200).json(sendMessage(true, refresh.message, refresh.data))
        } else {
            logger.error(`${refresh?.message} ${refresh?.data.email}`)
            res.status(403).json(sendMessage(false, refresh.message, refresh.data))
        }
    } catch (error) {
        return res.send(sendMessage(false, "Internal server error", error))
    }
}

export const loginSuperAdmin = async (req, res, next) => {

    try {
        await logInSuperAdminService(req, res)

    } catch (error) {
        res.status(500).json(sendMessage(false, "Internal server error"))
    }
}

export const changePasswordSuperAdmin = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, conformPassword, email } = req.body;
        const change = await changepasswordSuperAdminService(req, oldPassword, newPassword, conformPassword, email)
        if (change?.status) {
            logger.info(`${change.message} ${change.data.email}`)
            return res.status(200).json(change)
        } else {
            logger.error(`${change?.message} ${change?.data.email}`)
            return res.status(403).json(change)
        }
    } catch (error) {
        return res.status(500).json(sendMessage(false, "Interanal server error", error))
    }
}