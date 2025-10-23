import React from 'react'
//import { useAuthStore } from '../store/useAuthStore'
import ChatContainer from '../components/ChatContainer'
import NoChatSelected from '../components/NoChatSelecteded'
import Sidebar from '../components/Sidebar'
import { useChatStore } from '../store/useChatStore'

const HomePage = () => {

  //const {selectedUser} = useAuthStore();
  const {selectedUser} = useChatStore();


  return (
    <div className='h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-50'>
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-white/40 backdrop-blur-sm rounded-2xl shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] border border-white/20 overflow-hidden relative'>

          <div className='absolute inset-0 pointer-events-none homepage-blobs' aria-hidden>
            <div className='homepage-blob hb1' />
            <div className='homepage-blob hb2' />
            <div className='homepage-blob hb3' />
          </div>

          <div className='flex h-full rounded-lg overflow-hidden relative z-10'>
            <Sidebar />

            {!selectedUser ? <NoChatSelected/> : <ChatContainer />}

          </div>

        </div>
      </div>
    </div>
  )
}

export default HomePage
