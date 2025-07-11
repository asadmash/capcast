

import React from 'react'
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';

const Page = () => {
  return (
    <main className='wrapper page'>
      <Header title='All Videos' subHeader='Public Library'/>
      <h1 className="text-2xl font-karla">Welcome to loom</h1>

      {/* STEP:3 RENDER VIDEO CARD COMPONENET */}
      <VideoCard/>
    </main>
  )
}

export default Page