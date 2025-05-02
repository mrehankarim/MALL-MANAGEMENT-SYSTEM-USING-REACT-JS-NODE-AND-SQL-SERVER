import React from 'react'
import Navbar from '../componenets/Navbar'
import Hero from '../componenets/Hero'
import About from '../componenets/About'
import Pricing from '../componenets/Pricing'
import Contact from '../componenets/Contact'
import Footer from '../componenets/Footer'
const Home = () => {
  return (
    <>
      
      <Navbar></Navbar>
      <Hero></Hero>
      <Pricing></Pricing>
      <About></About>
      <Contact></Contact>
      <Footer></Footer>
    </>
  )
}

export default Home
