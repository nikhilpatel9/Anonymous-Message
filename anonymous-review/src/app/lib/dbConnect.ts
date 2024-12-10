/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";

type ConnectionObject ={
    isConnected?:number
}
const connection:ConnectionObject ={}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("already connected");
        return
    }
    try{
        const db=await mongoose.connect(process.env.MONGODB_URI||'',{})
        connection.isConnected =db.connections[0].readyState
        console.log('====================================');
        console.log("DB Connected");
        console.log('====================================');
    }catch(error){
        console.log('====================================');
        console.log("Error connecting",error);
        console.log('====================================');
        process.exit(1)
    }
}
export default dbConnect