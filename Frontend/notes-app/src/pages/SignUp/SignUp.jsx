import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper'
import { Link, useNavigate } from 'react-router-dom'
import axiosIntance from '../../utils/axiosInstance'
const SignUp = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const navigate = useNavigate()
  const [password,setPassword] =useState("")
  const [error, setError] = useState(null);
  
  const handleSignUp = async(e) => {
    e.preventDefault();
    console.log(name, email, password)
    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return
    }
     if (!password) {
      setError("Please enter your password.");
      return;
    }
  setError("")
      
    //  SignUp api call 
    try {
  const response = await axiosIntance.post("/create-account/", {
    fullName: name,
    email: email,
    password: password,
  });

  console.log("Signup Response:", response.data); // Debugging ke liye

  // Agar error aya
  if (response.data?.error) {
    setError(response.data.message || "Something went wrong");
    return;
  }

  // Agar token mila
  if (response.data?.accessToken) {
    localStorage.setItem("token", response.data.accessToken);
    navigate("/dashboard");
  } else {
    setError("Signup successful but token not received from server.");
  }
} catch (error) {
  console.error("Signup Error:", error);

  if (error.response?.data?.message) {
    setError(error.response.data.message);
  } else {
    setError("An unexpected error occurred. Please try again.");
  }
}


        
  }
  return (
   <>
    <Navbar />
      <div className='flex items-center justify-center mt-28 '>
         <div className='w-96 border border-gray-300  rounded bg-white px-7 py-10'>
            <form onSubmit={handleSignUp} >
             <h4 className='text-2xl mb-7'>SignUp</h4>
            <input
              type="text"
              className='text-sm  mb-4 border border-gray-300 rounded p-2 px-4 w-full  focus:outline-none '
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className='text-sm  mb-4 border border-gray-300 rounded p-2 px-4 w-full  focus:outline-none '
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> 
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error &&
              <p className='text-red-500 text-xs pb-1'>
                {error}</p>}
            <button type='submit' className='bg-blue-500 p-1 px-4 rounded text-white'>Create Account</button>
            <p className='text-sm text-center mt-4'>
                          Already have an account?{""}
                <Link to="/login"className=' font-medium text-blue-500 underline'  >
                             Login
              </Link>
            </p>
          </form>
        </div>
      </div> 
    </>
    
  )
}

export default SignUp