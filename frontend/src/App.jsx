import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Tailwinds from "./components/tailwinds"
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage' 
import axios from 'axios'
import { axiosInstance } from './lib/axios'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
import { Navigate } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import bgs from './assets/bgs pic.png'
 
 
 const App = () => {
  const {authUser,checkAuth, isCheckingAutrh} =useAuthStore()

  useEffect(()=>{
    checkAuth();
  },[authUser]);

  console.log({authUser});

  if(  isCheckingAutrh&&!authUser){
    return (
      <div className='w-screen h-screen flex justify-center items-center '>
        <Loader className='w-10 h-10 animate-spin' />
      </div>
    )
  }



   return (
     <div className="min-h-screen bg-[#000035]">

       

       <Navbar/>
       <Routes>
         <Route path='/' element={authUser ? <HomePage/> :<Navigate to ="/login" /> } />
         <Route path='/signup' element={!authUser ?<SignUpPage/> : <Navigate to="/"/>} />
         <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/"/>} />
         <Route path='/setting' element={<SettingPage/>} />
         <Route path='/profile' element={authUser? <ProfilePage/> : <Navigate to ="/login" />} />
       </Routes>
       <Toaster/>
     </div>
   )
 }
 
 export default App
 