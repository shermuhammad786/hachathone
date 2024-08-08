import mongoose from "mongoose";

 
const RoleTable = new mongoose.Schema({
    roleName:{
        type:String,
        required:true,
        default:"tenant"
    },
    description:{
        type:String,
        required:true
    },
    permission:{
        type:String,
        required:true
    }
},
{timestamps:true}
) 

export const roleTableModel = mongoose.model('RoleTable', RoleTable);