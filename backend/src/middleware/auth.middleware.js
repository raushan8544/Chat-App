import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const potectRoute = async (req , res,next)=>{
    try{
        const token = req.cookies.jwt;

        if(!token){
                console.log("potectRoute: no token in cookies");
            return res.status(400).json({
                success:false,
                message:"No Token provide , unauthorized "
            });
        }

 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            console.log("potectRoute: token invalid after verify");
            return res.status(401).json({
                success:false,
                message:"Invalid Token"
            })
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(402).json({
                success:false,
                message:"User not found"
            })
        }

        req.user = user;
        next();
            
   

    }
    catch(error){
        console.log("Error in middlware",error.message);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })

    }
}