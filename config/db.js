import mongoose from "mongoose";

const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("DB is connected using mongoose...")
    } catch (error) {
        throw error
    }
}

export default connectToDb;