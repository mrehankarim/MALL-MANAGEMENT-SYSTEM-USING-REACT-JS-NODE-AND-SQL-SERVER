import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  Grid, 
  Typography, 
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  Feedback as FeedbackIcon,
  Store as StoreIcon,
  Groups as GroupsIcon,
  Paid as PaidIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
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
  const [showAddShops, setShowAddShops] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showPayroll, setShowPayroll] = useState(false);

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

  const actionButtons = [
    {
      label: "Add Customer",
      icon: <PersonAddIcon />,
      action: () => setSignup(prev => !prev)
    },
    {
      label: "Insert Bill",
      icon: <ReceiptIcon />,
      action: () => setRevenue(prev => !prev)
    },
    {
      label: "Generate Rent",
      icon: <AttachMoneyIcon />,
      action: generateMonthlyRent
    },
    {
      label: "Add Feedback",
      icon: <FeedbackIcon />,
      action: () => setShowFeedbackForm(true)
    },
    {
      label: "Add Shops in Bulk",
      icon: <StoreIcon />,
      action: () => setShowAddShops(true)
    },
    {
      label: "Add Employee",
      icon: <GroupsIcon />,
      action: () => setShowAddEmployee(true)
    },
    {
      label: "Generate Payroll",
      icon: <PaidIcon />,
      action: () => setShowPayroll(true)
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      
      {/* Action Buttons Section */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#050505' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {actionButtons.map((button, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Tooltip title={button.label}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={button.icon}
                  onClick={button.action}
                  sx={{
                    py: 1.5,
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    }
                  }}
                >
                  {button.label}
                </Button>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ pr: 8.5, pl: 30.5 }}> {/* 12px right padding */}
            <OwnerRevenueCard />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ pl: 1.5 }}> {/* 12px left padding */}
            <OwnerExpenseCard />
          </Box>
        </Grid>
      </Grid>

      {/* Modals */}
      {signup && <AddCustomer setSignUp={setSignup} />}
      {revenue && <InsertBill setRevenue={setRevenue} />}

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

      {/* Other Modals */}
      {showAddShops && <AddShops open={showAddShops} onClose={() => setShowAddShops(false)} />}
      {showAddEmployee && <AddEmployee setAddEmployee={setShowAddEmployee} />}
      {showPayroll && <GeneratePayroll open={showPayroll} onClose={() => setShowPayroll(false)} />}
    </Box>
  );
};

export default OwnerDashboard;