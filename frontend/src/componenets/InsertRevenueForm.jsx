import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const InsertRevenueForm = ({ open, onClose, title, storeId }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    total_earnings: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        console.log(formData);
      const response = await axios.post(
        `http://localhost:3000/api/v1/customer/insertrevenue?store_id=${1}`,
        formData,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      console.log(response);
      alert(`${title} inserted successfully!`);
      onClose();
    } catch (error) {
      setError('Insertion failed. Please try again.');
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
            backgroundColor: theme.palette.background.default,
            width: { md: '50%', xs: '90%' },
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
            Insert Revenue
          </Typography>

          {error && (
            <Typography color="error" variant="body2" textAlign="center" mb={2}>
              {error}
            </Typography>
          )}

          <TextField
            name="total_earnings"
            label="Total Earnings"
            type="number"
            value={formData.total_earnings}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{
              step: '0.01',
            }}
            sx={{
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#192230' },
                '&:hover fieldset': { borderColor: '#192230' },
                '&.Mui-focused fieldset': { borderColor: '#192230' },
              },
            }}
          />

          <TextField
            name="date"
            label="Date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={{
            '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#192230' },
                '&:hover fieldset': { borderColor: '#192230' },
                '&.Mui-focused fieldset': { borderColor: '#192230' },
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                filter: 'invert(1)', // this makes the calendar icon white
                },
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Insert'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default InsertRevenueForm;
