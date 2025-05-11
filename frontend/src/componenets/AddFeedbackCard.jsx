import React, { useState } from 'react';
import { Card, Box, Typography } from '@mui/material';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import AddFeedbackForm from './AddFeedbackForm'; // Import the form component

const AddFeedbackCard = () => {
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
          width: '80%',
          maxWidth: 270,
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
            backgroundColor: '#3b82f6',
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
          <FeedbackOutlinedIcon sx={{ color: '#ffffff', fontSize: 30 }} />
        </Box>

        {/* Main Title */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 'normal', fontSize: '1.1rem' }}
        >
          Add Feedback
        </Typography>
      </Card>

      {/* AddFeedbackForm Component as a Popup */}
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
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
            sx={{
              position: 'relative',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: 4,
              width: { md: '50%', xs: '90%' },
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