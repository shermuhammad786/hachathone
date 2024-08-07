import { roleTableModel } from "../models/role.model";


class RoleTable{
   RoleById = async(id:any)=>{
        const foundUser = await roleTableModel.findById(id);
        return foundUser
    }
   RoleByIdAndUpdate = async(id:any,data:any)=>{
        const foundUser = await roleTableModel.findByIdAndUpdate(id,data);
        return foundUser
    }
   RoleByIdAndDelete = async(id:any)=>{
        const foundUser = await roleTableModel.findByIdAndDelete(id);
        return foundUser
    }
    UserByName = async(roleName:any)=>{
        const foundUser = await roleTableModel.findOne({roleName});
        return foundUser
    }
}
export default RoleTable

