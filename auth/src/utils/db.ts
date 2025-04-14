import {config} from "../config";
import mongoose from "mongoose";

const dbConnection=async()=>{
    try{
        await mongoose.connect(config.DB_URL);
        console.log("DB Connected...");
    }catch(err){
        console.log("Error on DB connection");
        process.exit(1);
    }
}
export default dbConnection;