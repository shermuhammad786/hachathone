import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
},
    { timestamps: true }
)

export const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);