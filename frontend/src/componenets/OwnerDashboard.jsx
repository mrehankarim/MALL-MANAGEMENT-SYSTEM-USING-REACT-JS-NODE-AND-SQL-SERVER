
import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import AddCustomer from './AddCustomer';
import InsertBill from './InsertBIll';
import OwnerRevenueCard from './OwnerRevenueCard';
import OwnerExpenseCard from './OwnerExpenseCard';
import OwnerAddFeedbackForm from './OwnerAddFeedbackForm';
import AddShops from "../componenets/AddShops"
import axios from 'axios';

import AddEmployee from './AddEmployee'
import GeneratePayroll from './GeneratePayroll'

const OwnerDashboard = () => {
  const [signup, setSignup] = useState(false);
  const [revenue, setRevenue] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAddShops, setShowAddShops] = useState(false)
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showPayroll, setShowPayroll] = useState(false)

  const generateMonthlyRent = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/subscriber/add/monthlyrent',
        {},
        { withCredentials: true }
      );
      alert("Rent generated successfully!");
    } catch (error) {
      console.error("Error generating rent:", error);
      alert("Rent generation failed");
    }
  };
  

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <Button variant="outlined" onClick={() => setSignup(prev => !prev)}>
          Add Customer
        </Button>
        <Button variant="outlined" onClick={() => setRevenue(prev => !prev)}>
          Insert Bill
        </Button>
        <Button variant="outlined" onClick={generateMonthlyRent}>
          Generate Rent
        </Button>
        <Button variant="outlined" onClick={() => setShowFeedbackForm(true)}>
          Add Feedback
        </Button>
      </Box>

      {signup && <AddCustomer setSignUp={setSignup} />}
      {revenue && <InsertBill setRevenue={setRevenue} />}

      <OwnerRevenueCard />
      <OwnerExpenseCard />

      {/* Feedback Modal */}
      {showFeedbackForm && (
        <Box
          onClick={() => setShowFeedbackForm(false)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 9998,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'relative',
              borderRadius: '10px',
              padding: 4,
              width: { md: '40%', xs: '90%' },
              backgroundColor: '#3a3845',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            <OwnerAddFeedbackForm onClose={() => setShowFeedbackForm(false)} />
          </Box>
        </Box>
      )}
      <br />
      <Box sx={{display:"flex",gap:"10px"}}>

      <Button variant='outlined' onClick={() => setShowAddShops(true)}>Add Shops in Bulk</Button>
      {showAddShops && <AddShops open={showAddShops} onClose={() => setShowAddShops(false)} />}
      <Button variant='outlined' onClick={() => setShowAddEmployee(true)}>Add Employee</Button>
      {showAddEmployee && <AddEmployee setAddEmployee={setShowAddEmployee} />}

      <Button variant='outlined' onClick={() => setShowPayroll(true)}>Generate Employees Payroll</Button>
      {showPayroll && <GeneratePayroll open={showPayroll} onClose={() => setShowPayroll(false)} />}
        </Box>
    </>
  );
};

export default OwnerDashboard;