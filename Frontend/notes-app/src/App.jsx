import React from 'react'
import Home from './pages/Home/Home'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'

let routes = (
  <Router>
    <Routes>
      <Route path='/dashboard' exect element={<Home />} />
    <Route path='/login' exect element={<Login/>}/>
    <Route path='/signup' exect element={<SignUp/>}/>
      
    </Routes>
  </Router>
)
const App = () => {
  return (
    <div>
      
    {routes}
    </div>
  )
}

export default App
