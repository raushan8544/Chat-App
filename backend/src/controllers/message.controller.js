import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../database/cloudinary.js";

export const getUserForSidebar = async (req ,res)=>{

    try{
        const loggedInId = req.user._id;
        const filteredUser = await User.find({_id: {$ne:loggedInId}}).select("-password");

        res.status(200).json(filteredUser);

    }
    catch(error){
        console.error("Error in getUserForSiderbar",error.message);
        res.status(500).json({
            error:"Internal server error"
        });

    }
    
}


export const  getMessage = async(req ,res)=>{
    try{
        const {id:userToChatId} = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId , receiverId:userToChatId},
                {sendId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(messages)


    }
    catch(error){

        console.log("Error in getMessages controller",error.message);
        res.status(500).json({error:"Internal Server error"})

    }
}

export const sendMessage  = async (req,res) => {
    try{

        const {text,image}= req.body;
        const {id:receiverId}=req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            //uploade on cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMassage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })

        await newMassage.save();

        res.status(201).json(newMassage);


    }
    catch(error){

        console.log("Error in sendMessages controller",error.message);
        res.status(500).json({error:"Internal Server error"})

    }
}