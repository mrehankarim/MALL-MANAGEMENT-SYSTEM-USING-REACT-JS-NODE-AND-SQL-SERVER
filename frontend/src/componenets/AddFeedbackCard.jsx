import React, { useState } from 'react';
import { Card, Box, Typography } from '@mui/material';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import AddFeedbackForm from './AddFeedbackForm';

const AddFeedbackCard = () => {
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
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // Purple gradient
          border: 'none',
          borderRadius: '12px',
          padding: '18px 24px',
          margin: 3,
          width: '90%',
          height: 70,
          maxWidth: 250,
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(139, 92, 246, 0.4)', // Purple shadow
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          },
          '&:active': {
            transform: 'translateY(0)',
          }
        }}
      >
        {/* Icon Container */}
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
          <FeedbackOutlinedIcon sx={{ color: '#ffffff', fontSize: 28 }} />
        </Box>

        {/* Main Title */}
        <Typography
          variant="h6"
          sx={{ 
            fontWeight: 500, 
            fontSize: '1.15rem',
            letterSpacing: '0.5px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}
        >
          Add Feedback
        </Typography>
      </Card>

      {/* Original Form Design (unchanged) */}
      {openForm && (
        <Box
          onClick={handleClose}
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
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            <AddFeedbackForm onClose={handleClose} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default AddFeedbackCard;