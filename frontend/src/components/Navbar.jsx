import {MessageSquare, LogOut, Settings, User } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom'


const Navbar = () => {
  const {logout, authUser} = useAuthStore();

  return (
  <header className=" border-b border-gray-200 fixed navbar-gradient w-full top-0 z-40 backdrop-blur-lg  ">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center  justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-blue-600" />
            </div>
           <span className=" text-3xl font-bold  bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text"> Talko</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/setting" className="btn-animated flex gap-1 items-center py-1 px-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg">
            <Settings className="w-7 h-7" />
            <span className="hidden sm:inline relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">Setting</span>
          </Link>
          {authUser && (
            <>
              <Link to="/profile" className="btn-animated flex gap-1 items-center py-1 px-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg">
                <User className="w-7 h-7" />
                <span className="hidden sm:inline relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">Profile</span>
              </Link>
              <button className="btn-animated flex gap-1 items-center py-1 px-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg" onClick={logout}>
                <LogOut className="w-7 h-7" />
                <span className="hidden sm:inline relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent  ">Logout</span>
              </button>

              
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar
