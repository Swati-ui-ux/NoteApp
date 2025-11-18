import React from 'react'

const EmptyCard = ({addNoteImg,message}) => {
  return (
     <div className="flex mt-8 w-screen flex-col items-center justify-center bg-white">
  <div className="w-full max-w-md px-4">
    <img 
      src={addNoteImg} 
      alt="no notes" 
      className="w-[80%] text-gray-500 h-auto object-contain" 
    />
  </div>
  <p className="mt-5 w-3/4 text-center text-sm font-medium text-slate-700 leading-7">
    {message}
          </p>
         
</div>

  )
}

export default EmptyCard
