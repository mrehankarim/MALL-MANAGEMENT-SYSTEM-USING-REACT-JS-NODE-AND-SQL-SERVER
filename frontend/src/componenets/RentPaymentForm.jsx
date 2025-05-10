import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, IconButton, CircularProgress, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const RentPaymentForm = ({ open, onClose, title, shopNo }) => {
  const theme = useTheme(); // Use the theme for consistent styling
  const [formData, setFormData] = useState({
    shop_no: shopNo || '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        title === 'Pending Rent'
          ? 'http://localhost:3000/api/v1/customer/payrent'
          : 'http://localhost:3000/api/v1/customer/paybill';

      const response = await axios.post(endpoint, formData, {
        headers: {
          Accept: 'application/json',
        },
      });

      console.log(response);
      alert(`${title} payment successful!`);
      onClose(); // Close the modal after successful submission
    } catch (error) {
      setError('Payment failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 9998,
      }}
    >
      <Container
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            border: '2px solid #192230',
            borderRadius: '10px',
            p: 4,
            backgroundColor: theme.palette.background.default, // Use theme background
            width: { md: '50%', xs: '90%' },
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
            {title} Payment
          </Typography>

          {error && (
            <Typography color="error" variant="body2" textAlign="center" mb={2}>
              {error}
            </Typography>
          )}

          <TextField
            name="shop_no"
            label="Shop Number"
            value={formData.shop_no}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#192230' },
                '&:hover fieldset': { borderColor: '#192230' },
                '&.Mui-focused fieldset': { borderColor: '#192230' },
              },
            }}
          />
          <TextField
            name="amount"
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#192230' },
                '&:hover fieldset': { borderColor: '#192230' },
                '&.Mui-focused fieldset': { borderColor: '#192230' },
              },
            }}
          />
          <Button
            variant="outlined"
            type="submit"
            disabled={loading}
            sx={{
              mt: 2,
              borderColor: '#3b82f6',
              color: '#3b82f6',
              '&:hover': { backgroundColor: '#3b82f6', color: '#fff' },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay Now'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RentPaymentForm;