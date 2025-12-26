import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import {Link, useNavigate, } from "react-router-dom"
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper'
import axiosIntance from '../../utils/axiosInstance'

const Login = () => {
    let [email, setEmail] = useState("");
    let [password,setPassword] = useState("")
    let [error, setError] = useState(null);
    const navigate = useNavigate()
    let handleLogin =async(e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!password) {
            setError("Please enter the password.");
            return;
        }
        setError("")
        
        // Login api call
        try {
            const response = await axiosIntance.post("/login", {
                email: email,
                password:password,
            })
            
            // handle successfull login response;
            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                 setError("An unexpected error occurred.Please try again.")
            
            }
        }
        
    }
  return (
      <>
          <Navbar />
          <div className='flex items-center justify-center mt-28 '>
              <div className='w-96 border border-gray-300  rounded bg-white px-7 py-10'>
              
                  <form onSubmit={handleLogin}>
                      <h4 className='text-2xl mb-7'>Login</h4>
                      <input type="text" className='text-sm  mb-4 border border-gray-300 rounded p-2 px-4 w-full  focus:outline-none  ' placeholder='Enter Email '
                          
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                      <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder={""} />
                      {error&& <p className='text-red-500 text-xs pb-1'>{error}</p>}
                      <button type='submit' className='bg-blue-500 p-1 px-4 rounded text-white'>Login</button>
                      <p className='text-sm text-center mt-4'>
                          Not registered yet?{" "}
                          <Link to="/signUp"className=' font-medium text-blue-500 underline'  >
                              Create an Account
                          </Link>
                      </p>
                  </form></div>
          </div>
      
      </>
  )
}

export default Login