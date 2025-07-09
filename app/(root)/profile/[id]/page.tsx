import React from 'react'

const page = async({params}: ParamasWithSearch) => {
  const {id}=  params;
    return (
    <div>USER ID: {id}</div>
  )
}

export default page