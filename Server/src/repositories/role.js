import { roleTableModel } from "../models/role.model.js";


class RoleTable{
   RoleById = async(id)=>{
        const foundUser = await roleTableModel.findById(id);
        return foundUser
    }
   RoleByIdAndUpdate = async(id,data)=>{
        const foundUser = await roleTableModel.findByIdAndUpdate(id,data);
        return foundUser
    }
   RoleByIdAndDelete = async(id)=>{
        const foundUser = await roleTableModel.findByIdAndDelete(id);
        return foundUser
    }
    UserByName = async(roleName)=>{
        const foundUser = await roleTableModel.findOne({roleName});
        return foundUser
    }
}
export default RoleTable

