import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Tailwinds from "./components/tailwinds"
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage' 
 
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
import { Navigate } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'

import { useThemeStore } from './store/useThemeStore'
 
 
 const App = () => {
  const { authUser, checkAuth, isCheckingAutrh } = useAuthStore()
  const {theme} = useThemeStore();
  const { animationsEnabled } = useThemeStore();

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    // also set on body and root to ensure theming applies in all contexts
    const body = document.body;
    body.setAttribute('data-theme', theme);
    const root = document.getElementById('root');
    if (root) root.setAttribute('data-theme', theme);
    console.debug('App: set data-theme to', theme, 'html/body/root attributes now:', html.getAttribute('data-theme'), body.getAttribute('data-theme'), root ? root.getAttribute('data-theme') : null);
  }, [theme]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    if (!animationsEnabled) {
      html.classList.add('no-animations');
      body.classList.add('no-animations');
      if (root) root.classList.add('no-animations');
    } else {
      html.classList.remove('no-animations');
      body.classList.remove('no-animations');
      if (root) root.classList.remove('no-animations');
    }
    console.debug('App: animationsEnabled', animationsEnabled);
  }, [animationsEnabled]);

 

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  

  console.log({authUser});

  if(  isCheckingAutrh&&!authUser){
    return (
      <div className='w-screen h-screen flex justify-center items-center '>
        <Loader className='w-10 h-10 animate-spin' />
      </div>
    )
  }



   return (
     <div className="min-h-screen text-base-content pt-20" >


        

       

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
 