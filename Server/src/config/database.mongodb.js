import mongoose from 'mongoose'

import { environments } from '../environments/environments.js'

const mongodbConnection = async () => {
 const connect = await mongoose.connect(environments.MONGODB_URL);
 if(connect){
   console.log("db connect")
 }else{
  console.log("no db conncet");
 }
}

mongodbConnection()