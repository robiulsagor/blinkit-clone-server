import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected ");

        return connect
    } catch (error) {
        console.log(`Connection error: ${error}`);
        process.exit(1)
    }
}