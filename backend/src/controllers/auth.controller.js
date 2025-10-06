import { generateToken } from "../database/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../database/cloudinary.js";
//import {generateToken} from 




export const signup = async (req,res)=>{
    const {email,fullName,password}=req.body;
    try{
        if(!email || !fullName || !password){
            return res.status(400).json({
               success:false,
               message:"All field require"
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                success:false,
                message:"password must be at least 6 character"
            });
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                message:"Email already exite"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword,
        });


        if (newUser){
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });
        }  else{
            res.status(400).json({
                message:"Invalide User data"
            });
        }
         

    }
    catch(error){

        console.log( "Error in signup controller",error.message);
        return res.status(500).json({
            message:"Internal server error"
        })

    }


}

export const login = async (req,res)=>{
    const {email,password}=req.body

    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                success:false,
                message:"user does not exite"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                message:"Password is Incorrect"
            }

            )
        }

        generateToken(user._id,res)

        res.status(200).json({
            success:true,
            message:"User loing succefully",

            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,

        });

    }
    catch(error){
        console.log("Error in controller",error.message);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })

    }

    
     
}

export const logout = async (req,res)=>{
    try{
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({
            success:true,
            message:"Logged out succesfully"
        })

    }
    catch(error){
        console.log("Erron in controller",error.message)

        res.status(500).json({
            success:false,
            message:"enternal server error"
        })

    }

     
}

export const updateProfile = async (req,res)=>{
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(profilePic){
            return res.status(400).json({
                success:false,
                message:"Profile pic require"

            })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updateUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},
            {new:true}
        );

        res.status(200).json(updateUser)

    }
    catch(error){
        console.log("Error in update profile",error.message);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })

    }
}


export const checkAuth = (req,res)=>{
    try{
        res.status(200).json(req.user)
         

    }
    catch (error){

        console.log("checkAuth error",error.message);

        res.status(500).json({
            success:false,
            message:'Internal server error'
        })

    }
}

