import mongoose, { MongooseError } from "mongoose";
import env from "./env.config"; 

export  async function connectDB(){
    try {
        await mongoose.connect(env.MONGO_URL);
        console.log('Connected to mongodb 🚀')
    } catch (error) {
        console.log('Mongo Error, ',error instanceof MongooseError?error.message:error);
    }
}

export { env };
