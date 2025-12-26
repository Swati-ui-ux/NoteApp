import React, { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6"
const PasswordInput = ({ value, onChange, placeholder }) => {
    let [showPassword, setShowPassword] = useState(false);
    
    let handleShowPassword = () => {
    setShowPassword(!showPassword)
    }
  return (
      <div className='flex items-center bg-transparent border-[1.5px]  px-5 rounded border-gray-300   mb-3'>
          <input type={showPassword ? "text" : "password"} placeholder={placeholder || "Password"} className='w-full text-sm  focus:outline-none py-3 mr-3 rounded outline-none' value={value} onChange={onChange} />
         {showPassword? <FaRegEye size={22} className='text-blue-500 cursor-pointer' onClick={()=>handleShowPassword()} />: <FaRegEyeSlash size={22} className='text-gray-500 cursor-pointer' onClick={()=>handleShowPassword()} />}
      </div>
  )
}

export default PasswordInput