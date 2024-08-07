import bcrypt from "bcrypt";
import { sendMessage } from "./sendMessage.js";

export const bcryptHashingData = (data) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data, salt)
    return hash;
}

export const bcryptCompareData = (data, userData) => {
  const matching = bcrypt.compareSync(data,userData);
  if(matching){
    return sendMessage(true,"data matched")
  }else{
    return sendMessage(false,"data does not matched")
  }
}