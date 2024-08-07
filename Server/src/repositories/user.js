import { OTP } from "../models/otp.model.js";
import { UserModel } from "../models/user.model.js";

class User {
    UserById = async (id) => {
        const foundUser = await UserModel.findById(id);
        if (!foundUser) throw new Error(`The user with ${id} id does not exist.`);
        return foundUser
    }

    UserByIdAndUpdate = async (id, data) => {
        const foundUser = await UserModel.findByIdAndUpdate(id, data);
        if (!foundUser) throw new Error(`The user with ${id} id does not exist.`);
        return foundUser
    }
    UserByIdAndDelete = async (id) => {
        const foundUser = await UserModel.findByIdAndDelete(id);
        if (!foundUser) throw new Error(`The user with ${id} id does not exist.`);
        return foundUser
    }
    TenantUsers = async (tenantId) => {
        const foundUser = await UserModel.find(tenantId);
        if (!foundUser) throw new Error(`The user with ${tenantId} id does not exist.`);
        return foundUser
    }


    UserByEmail = async (email) => {
        const foundUser = await UserModel.findOne({ email: email });
        return foundUser
    }
    UserByUserName = async (userName) => {
        const foundUser = await UserModel.findOne({ userName });
        return foundUser
    }
    OTPUserByEmail = async (email) => {
        const foundUser = await OTP.findOne({ email });
        return foundUser
    }
    TokenUser = async (id) => {
        const user = await RefreshTokenModel.findById(id);
        return user
    }

}
export default User

