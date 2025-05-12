import React from 'react'
import { Button } from '@mui/material'
import { useState } from 'react'
import AddCustomer from './AddCustomer'
const OwnerDashboard = () => {
    const[signup,setSignup]=useState(false)
  return (
    <>
     <Button variant='outlined' onClick={()=>setSignup(prev=>!prev)}>Add customer</Button> 
     {
        signup && (<AddCustomer setSignUp={setSignup}/>)
     }
    </>
  )
}

export default OwnerDashboard
