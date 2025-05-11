import React, { useState } from 'react';
import { Card, Box, Typography } from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import InsertRevenueForm from './InsertRevenueForm'; // Import the form component

const InsertStoreRevenueCard = () => {
  const [openForm, setOpenForm] = useState(false); // State to toggle the form

  const handleClick = () => {
    setOpenForm(true); // Open the form when the card is clicked
  };

  const handleClose = () => {
    setOpenForm(false); // Close the form
  };

  return (
    <>
      <Card
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid #3b82f6',
          borderRadius: '14px',
          padding: '16px 24px',
          margin: 5,
          width: '90%',
          maxWidth: 300,
          color: '#f1f5f9',
          cursor: 'pointer',
          transition: '0.3s',
          '&:hover': {
            background: 'rgba(59, 130, 246, 0.15)',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
          },
        }}
      >
        {/* Icon Container */}
        <Box
          sx={{
            backgroundColor: '#3b82f6', // Blue background for icon
            borderRadius: '12px',
            padding: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 2,
            minWidth: 56,
            minHeight: 56,
          }}
        >
          <AttachMoneyOutlinedIcon sx={{ color: '#ffffff', fontSize: 30 }} />
        </Box>

        {/* Main Title */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 'normal', fontSize: '1.1rem' }}
        >
          Insert Daily Revenue
        </Typography>
      </Card>

      {/* InsertRevenueForm Component */}
      {openForm && (
        <InsertRevenueForm
          open={openForm}
          onClose={handleClose} // Pass the close handler
          title="Insert Revenue"
          storeId={1} // Pass the storeId as needed
        />
      )}
    </>
  );
};

export default InsertStoreRevenueCard;