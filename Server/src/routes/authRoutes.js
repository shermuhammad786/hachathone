import express from "express";
import { changePassword, changePasswordSuperAdmin, emailVerify, forgotPassword, login, loginSuperAdmin, refreshSuperAdminToken, refreshToken, resetPassword, signup, verifyOTP } from "../controllers/auth.js";
import { validateRequest } from "../middlewares/validateRequest.js"
import { emailValidate, signUpSchema } from "../joi/signup.js";
import { jwtAuth } from "../middlewares/jwt.middleware.js";
import { authorizeRole } from "../middlewares/identification.js";


const authRoutes = express.Router();

authRoutes.post("/verifyemail", validateRequest(emailValidate), emailVerify)
authRoutes.post("/verifyotp", verifyOTP)
authRoutes.post("/signup", validateRequest(signUpSchema), signup)
authRoutes.post("/login", login)
authRoutes.post("/forgot/password", forgotPassword)
authRoutes.post("/reset/password", resetPassword)
authRoutes.put("/change/password", jwtAuth, changePassword)
authRoutes.post("/refresh/:token", refreshToken);


authRoutes.post("/admin/refresh/:token", refreshSuperAdminToken);
authRoutes.post("/admin/login", loginSuperAdmin)
authRoutes.put("/admin/change/password", jwtAuth, authorizeRole("superAdmin"), changePasswordSuperAdmin)

export default authRoutes;
