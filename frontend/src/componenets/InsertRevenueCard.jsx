import React, { useState } from 'react';
import { Card, Box, Typography } from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import InsertRevenueForm from './InsertRevenueForm';

const InsertStoreRevenueCard = () => {
  const [openForm, setOpenForm] = useState(false);

  const handleClick = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  return (
    <>
      <Card
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: 'none',
          borderRadius: '12px',
          padding: '18px 24px',
          margin: 3,
          width: '90%',
          height: 70,
          maxWidth: 300,
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(16, 185, 129, 0.4)',
            background: 'linear-gradient(135deg, #10b981 0%, #0d9466 100%)',
          },
          '&:active': {
            transform: 'translateY(0)',
          }
        }}
      >
        {/* Icon Container with subtle background */}
        <Box
          sx={{
            borderRadius: '8px',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <AttachMoneyOutlinedIcon sx={{ color: '#ffffff', fontSize: 28 }} />
        </Box>

        {/* Main Title with better typography */}
        <Typography
          variant="h6"
          sx={{ 
            fontWeight: 500, 
            fontSize: '1.15rem',
            letterSpacing: '0.5px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}
        >
          Insert Daily Revenue
        </Typography>
      </Card>

      {/* Enhanced Modal/Popup Design */}
      {openForm && (
        <Box
          onClick={handleClose}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9998,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'relative',
              borderRadius: '16px',
              padding: 4,
              width: { md: '40%', xs: '90%' },
              maxWidth: 600,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              backgroundColor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
              }
            }}
          >
            <InsertRevenueForm
              open={openForm}
              onClose={handleClose}
              title="Insert Revenue"
              storeId={1}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default InsertStoreRevenueCard;