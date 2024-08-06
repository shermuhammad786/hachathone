import bcrypt from "bcrypt";
import { sendMessage } from "./sendMessage";

export const bcrypt_hashingData = (data: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data, salt)
    return hash;
}

export const bcrypt_compareData = (data: string, userData: string) => {
  const matching = bcrypt.compareSync(data,userData);
  if(matching){
    return sendMessage(true,"data matched")
  }else{
    return sendMessage(false,"data does not matched")
  }
}