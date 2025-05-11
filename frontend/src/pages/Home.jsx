import React, { useState } from 'react'
import Navbar from '../componenets/Navbar'
import Hero from '../componenets/Hero'
import About from '../componenets/About'
import Pricing from '../componenets/Pricing'
import Contact from '../componenets/Contact'
import Footer from '../componenets/Footer'
import Signup from '../componenets/Signup'
import Login from '../componenets/Login'
const Home = () => {
  const [SignUp,setSignUp]=useState(false)
  const [SignIn,setSignIn]=useState(false);
  return (
    <> 
      <Navbar SignIn={SignIn} SignUp={SignUp} setSignIn={setSignIn} setSignUp={setSignUp}></Navbar>
      <Hero></Hero>
      <Pricing></Pricing>
      {
        SignUp && (<Signup  setSignUp={setSignUp}/>)
        
      }
      {
        SignIn && <Login setLogin={setSignIn}/>
      }
      
      <About></About>
      <Contact></Contact>
      <Footer></Footer>
    </>
  )
}

export default Home
