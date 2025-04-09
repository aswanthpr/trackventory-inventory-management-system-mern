import mongoose, { MongooseError } from "mongoose";
import {env} from "@src/config/env.config";

export  async function connectDB(){
    try {
        await mongoose.connect(env.MONGO_URL);
        console.log('Connected to mongodb 🚀')
    } catch (error:unknown) {
        console.log('Mongo Error, ',error instanceof MongooseError?error.message:error);
    }
}