import monoose from 'mongoose';


export const connectDB =async()=>{
    try{
        await monoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

    }
    catch(err){
        console.log(err);

    }
}