import dotenv from 'dotenv';

dotenv.config()

export const environments = {
  PORT: process.env.PORT || 3030,
  
  mongoDBUrl: process.env.MONGODB_URL,
  baseUrl: process.env.WEB_LINK || "",
  jwtAccessTokenKey: process.env.JWT_SECRET_KEY || "",
  jwtRefreshTokenKey: process.env.JWT_REFRESH_SECRET_KEY || "",

  jwtAccessTokenExpireTime: process.env.JWT_SECRET_KEY_EXPIRE || "",
  jwtRefreshTokenExpireTime: process.env.JWT_REFRESH_SECRET_KEY_EXPIRE || "",

  adminAccessTokenKey: process.env.SUPER_ADMIN_ACCESS_TOKEN_KEY || "",
  adminAccessTokenExpireTime: process.env.SUPER_ADMIN_ACCESS_TOKEN_EXPIRE || "",
  adminRefreshTokenKey: process.env.SUPER_ADMIN_REFRESH_TOKEN_KEY || "",
  adminRefreshTokenExpireTime: process.env.SUPER_ADMIN_REFRESH_TOKEN_EXPIRE || "",
  sessionHistoryExpireTime: process.env.SESSION_HISTORY_EXPIRE || 30000,
}
