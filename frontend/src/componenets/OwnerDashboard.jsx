import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import AddCustomer from './AddCustomer'
import AddShops from './AddShops'
import AddEmployee from './AddEmployee'
import GeneratePayroll from './GeneratePayroll'

const OwnerDashboard = () => {
  const [signup, setSignup] = useState(false)
  const [showAddShops, setShowAddShops] = useState(false)
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showPayroll, setShowPayroll] = useState(false)

  return (
    <>
      <Button variant='outlined' onClick={() => setSignup(prev => !prev)}>Add customer</Button>
      {signup && (<AddCustomer setSignUp={setSignup} />)}

      <Button variant='outlined' onClick={() => setShowAddShops(true)}>Add Shops in Bulk</Button>
      {showAddShops && <AddShops open={showAddShops} onClose={() => setShowAddShops(false)} />}

      <Button variant='outlined' onClick={() => setSignup(prev => !prev)}>Allocate Shop</Button>
      {signup && (<AddCustomer setSignUp={setSignup} />)}

      <Button variant='outlined' onClick={() => setSignup(prev => !prev)}>Add Shop Bill</Button>
      {signup && (<AddCustomer setSignUp={setSignup} />)}

      <Button variant='outlined' onClick={() => setSignup(prev => !prev)}>Add Shop Rent</Button>
      {signup && (<AddCustomer setSignUp={setSignup} />)}

      <Button variant='outlined' onClick={() => setShowAddEmployee(true)}>Add Employee</Button>
      {showAddEmployee && <AddEmployee setAddEmployee={setShowAddEmployee} />}

      <Button variant='outlined' onClick={() => setShowPayroll(true)}>Generate Employees Payroll</Button>
      {showPayroll && <GeneratePayroll open={showPayroll} onClose={() => setShowPayroll(false)} />}
    </>
  )
}

export default OwnerDashboard