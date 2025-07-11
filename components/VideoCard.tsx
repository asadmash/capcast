// STEP: 01 RUN RAFCE TO CREATE A REACT ARROW COMPONENT
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const VideoCard = ({
    //STEP:2 ACCEPT AND DESTRUCTURE THE PROPS PASSED FROM PAGE.TSX
    id,
    title,
    thumbnail,
    userImg,
    username,
    createdAt,
    views,
    visbility,
    duration
}: VideoCardProps) => {
  return (
    // STEP:3 RENDER THE VIDEO CARDS ELEMENTS
    <Link href={`/video/${id}`} className='video-card'>
        <Image src={thumbnail} alt='thumbnail' width={290} height={160} className='thumbnail'/>
    </Link>
  )
}

export default VideoCard