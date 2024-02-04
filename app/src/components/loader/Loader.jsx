import React from 'react'

const Loader = ({ text = null }) => {
  return (
    <div className='flex flex-col items-center justify-center h-full w-full gap-3'>
      <span className="loading loading-spinner loading-md my-4"></span>
      {text &&
        <p className="">{text}</p>
      }
    </div>
  )
}

export default Loader