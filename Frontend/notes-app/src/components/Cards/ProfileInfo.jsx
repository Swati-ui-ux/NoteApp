import React from 'react'
import { getInitails } from '../../utils/helper'

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
      <div className='flex items-center gap-3'>
          <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-900 font-medium bg-slate-100'>
          {userInfo&&getInitails(userInfo.fullName)}
          </div>
          <p className='text-sm font-medium '>William</p>
          <button className='text-white cursor-pointer bg-blue-500 px-4 p-1 rounded' onClick={onLogout}>Logout</button>
      </div>
  )
}

export default ProfileInfo