import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert, Rating } from '@mui/material';
import axios from 'axios';

const OwnerAddFeedbackForm = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(null);
  const [status, setStatus] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/subscriber/add/feedback',
        { message, rating },
        { withCredentials: true }
      );
      setStatus('success');
      setMessage('Feedback submitted successfully');
      setSnackbarOpen(true);
      setMessage('');
      setRating(null);
    } catch (error) {
      console.error("Error submitting feedback:", error.response || error); // Log error to console for debugging

      const errorMessage = error.response?.data?.message || "Failed to submit feedback"; // Get detailed error message
      setStatus('error');
      setMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 3,
        padding: 3,
        backgroundColor: '#020317',
        borderRadius: 2,
        color: '#f1f5f9',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#3B82F6' }}>
        Add Feedback
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          placeholder="Write your feedback here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            mb: 3,
            input: { color: '#f1f5f9' },
            label: { color: '#f1f5f9' },
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#020317',
              borderColor: '#3B82F6',
              color: '#f1f5f9',
              '&:hover': { borderColor: '#2563EB' },
            },
          }}
        />
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: '#f1f5f9', mb: 1 }}>
            Rating:
          </Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            sx={{
              color: '#ffeb3b',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#3B82F6',
              color: '#f1f5f9',
              '&:hover': { backgroundColor: '#2563EB' },
              borderRadius: '8px',
              paddingX: 3,
              fullWidth: true,
            }}
          >
            Submit
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              mt: 2,
              borderColor: '#3B82F6',
              color: '#f1f5f9',
              '&:hover': { borderColor: '#2563EB', color: '#2563EB' },
              borderRadius: '8px',
              paddingX: 3,
              fullWidth: true,
            }}
          >
            Cancel
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={status}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OwnerAddFeedbackForm;
