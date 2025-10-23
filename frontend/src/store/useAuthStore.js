import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'
import toast from 'react-hot-toast'
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";
//import { data } from 'react-router-dom';
//import { logout } from '../../../backend/src/controllers/auth.controller';

export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers: [],
    socket:null,


    isCheckingAutrh:true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authUser:res.data})

            get().connectSocket()



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

            get().connectSocket()

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

            get().connectSocket()


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

            get().disConnectSocket()

        }
        catch(error){
            toast.error(toast.response.data.message);
            console.log("Error in logout ",error);

        }
    },

    //update profile
    updateProfile: async(data) =>{

         set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
        
    },

    connectSocket: () => {

        const {authUser} = get();
        if(!authUser || get().socket?.connected ) return;


        const socket = io( BASE_URL, {
            query: {
                userId:authUser._id
            }
        } )
        socket.connect()

        set({socket:socket});

         socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    },

    disConnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();

    }

     

    

}))