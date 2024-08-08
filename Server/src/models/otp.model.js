import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique:true
    },
    otpKey: {
      type: String,
      required: true,
      unique:true
    },
    password:{
      type:String,
    },
    used: { type: Boolean, default: false },

    expireIn:{type:Number},

    expire:{ type: Boolean, default: false }
  },
  { timestamps: true }
);

export const OTP = mongoose.model('otp', tokenSchema)