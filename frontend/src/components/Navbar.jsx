import {MessageSquare, LogOut, Settings, User } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom'


const Navbar = () => {
  const {logout, authUser} = useAuthStore();

  return (
    <header className=" border-b border-gray-200 fixed bg-[#000068]    w-full top-0 z-40 backdrop-blur-lg  ">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center  justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-blue-600" />
            </div>
           <span class=" text-3xl font-bold  bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text"> Talko</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/setting" className=" flex gap-1 items-center py-1 px-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <Settings className="w-7 h-7" />
            <span className="hidden sm:inline relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">Setting</span>
          </Link>
          {authUser && (
            <>
              <Link to="/profile" className=" flex gap-1 items-center py-1 px-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <User className="w-7 h-7" />
                <span className="hidden sm:inline relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">Profile</span>
              </Link>
              <button className="flex gap-1 items-center py-1 px-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={logout}>
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
