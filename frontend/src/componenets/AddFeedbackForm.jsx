import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Slider,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const SubmitFeedbackForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    message: '',
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, message: e.target.value });
  };

  const handleSliderChange = (e, newValue) => {
    setFormData({ ...formData, rating: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      console.log('form dataaaa', formData)
      const response = await axios.post(
        'http://localhost:3000/api/v1/customer/addfeedback',
        {
          message: formData.message,
          rating: formData.rating, 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccessMsg('Feedback submitted successfully!');
      setFormData({ message: '', rating: 0 });
    } catch (err) {
      console.error(err);
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        border: '2px solid #1e293b',
        borderRadius: '10px',
        p: 4,
        margin:0,
        backgroundColor: '#020317', // Dark background
        color: '#f1f5f9', // Light text color
        width: { md: '100%', xs: '100%' },
      }}
    >
      <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ color: '#3b82f6' }}>
        Submit Feedback
      </Typography>

      {error && (
        <Typography color="error" variant="body2" textAlign="center">
          {error}
        </Typography>
      )}
      {successMsg && (
        <Typography color="primary" variant="body2" textAlign="center">
          {successMsg}
        </Typography>
      )}

      <TextField
        label="Feedback Message"
        multiline
        rows={4}
        name="message"
        value={formData.message}
        onChange={handleChange}
        fullWidth
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#1e293b' },
            '&:hover fieldset': { borderColor: '#3b82f6' },
            '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
          },
          '& .MuiInputBase-input': { color: '#f1f5f9' },
          '& .MuiInputLabel-root': { color: '#94a3b8' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
        }}
      />

      <Box>
        <Typography gutterBottom sx={{ color: '#94a3b8' }}>
          Rating: {formData.rating.toFixed(1)}
        </Typography>
        <Slider
          value={formData.rating}
          onChange={handleSliderChange}
          step={0.5}
          marks
          min={0}
          max={5}
          valueLabelDisplay="auto"
          sx={{
            color: '#3b82f6',
            '& .MuiSlider-thumb': { backgroundColor: '#3b82f6' },
            '& .MuiSlider-track': { backgroundColor: '#3b82f6' },
            '& .MuiSlider-rail': { backgroundColor: '#1e293b' },
          }}
        />
      </Box>

      <Button
        variant="contained"
        type="submit"
        disabled={loading}
        sx={{
          backgroundColor: '#3b82f6',
          color: '#f1f5f9',
          '&:hover': { backgroundColor: '#2563eb' },
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Feedback'}
      </Button>

      <Button
        variant="text"
        onClick={onClose}
        sx={{
          color: '#94a3b8',
          '&:hover': { color: '#f1f5f9' },
        }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default SubmitFeedbackForm;