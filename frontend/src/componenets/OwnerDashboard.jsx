import React from 'react'
import { Box, Button } from '@mui/material'
import { useState } from 'react'
import AddCustomer from './AddCustomer'
import AddShops from './AddShops'
const OwnerDashboard = () => {
    const[signup,setSignup]=useState(false)
    const [showAddShops, setShowAddShops] = useState(false);

  return (
    <>
     <Button variant='outlined' onClick={()=>setSignup(prev=>!prev)}>Add customer</Button> 
     {
        signup && (<AddCustomer setSignUp={setSignup}/>)
     }
     <Button variant='outlined' onClick={() => setShowAddShops(true)}>Add Shops in Bulk</Button>
      {
      showAddShops && <AddShops open={showAddShops} onClose={() => setShowAddShops(false)} />
      }
     <Button variant='outlined' onClick={()=>setSignup(prev=>!prev)}>Allocate Shop</Button> 
     {
        signup && (<AddCustomer setSignUp={setSignup}/>)
     }
     <Button variant='outlined' onClick={()=>setSignup(prev=>!prev)}>Add Shop Bill</Button> 
     {
        signup && (<AddCustomer setSignUp={setSignup}/>)
     }
     <Button variant='outlined' onClick={()=>setSignup(prev=>!prev)}>Add Shop Rent</Button> 
     {
        signup && (<AddCustomer setSignUp={setSignup}/>)
     }
     <Button variant='outlined' onClick={()=>setSignup(prev=>!prev)}>Add Employee</Button> 
     {
        signup && (<AddCustomer setSignUp={setSignup}/>)
     }
     <Button variant='outlined' onClick={()=>setSignup(prev=>!prev)}>Generate Employees Payroll</Button> 
     {
        signup && (<AddCustomer setSignUp={setSignup}/>)
     }
    </>
  )
}

export default OwnerDashboard
