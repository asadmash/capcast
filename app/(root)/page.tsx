

import React from 'react'
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';

const Page = () => {
  return (
    <main className='wrapper page'>
      <Header title='All Videos' subHeader='Public Library'/>
      {/* <h1 className="text-2xl font-karla">Welcome to loom</h1> */}

      {/* STEP:3 RENDER VIDEO CARD COMPONENET */}
      <VideoCard
      // STEP:4 PASS PROPS TO THE VIDEOCARD COMPONENT
      id='1'
      title='CapCast Message - 01 july 2025'
      thumbnail='/assets/samples/thumbnail (1).png'
      createdAt= {new Date('2025-07-01')}
      userImg='/assets/images/jason.png'
      username='Jason'
      views={10}
      visibility='public'
      duration={156}
      />
    </main>
  )
}

export default Page