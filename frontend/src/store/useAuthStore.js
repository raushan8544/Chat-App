import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'
import toast from 'react-hot-toast'
import { data } from 'react-router-dom';
//import { logout } from '../../../backend/src/controllers/auth.controller';

export const useAuthStore = create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,


    isCheckingAutrh:true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authUser:res.data})



    }
    catch (error){
        set({authUser:null})
        console.log("Error in checkAuth",error);

    }
    finally{
        set({isCheckingAutrh:false});
    }
},

    signup: async (data)=>{
        set({isSigningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Signup successful");

        }
        catch (error){
            toast.error(error.response.data.message);
            console.log("Error in signup",error);

        }
        finally {
            set({isSigningUp:false});
        }
        
    },

    //login
    login : async (data)=>{
        set({isLoggingIn:true});
         
        try{
            const res = await axiosInstance.post('/auth/login',data);
            set({authUser:res.data});
            toast.success("Login successful");

        }
        catch(error){
            toast.error(error.response.data.message);
            console.log("Error in login", error);

        }
        finally{
            set({isLoggingIn:false});
        }

    },


    //logout
    logout: async() => {
        try{
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            toast.success("Logout successful");

        }
        catch(error){
            toast.error(toast.response.data.message);
            console.log("Error in logout ",error);

        }
    },

    //update profile
    updateProfile: async(data) =>{
        
    }
    

}))