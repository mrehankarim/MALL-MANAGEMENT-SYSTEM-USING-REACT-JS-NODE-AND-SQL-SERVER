import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const RentPaymentForm = ({ open, onClose, title }) => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    method: '',
    rent: null, 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingRents, setPendingRents] = useState([]); 

  useEffect(() => {
    
      const fetchPendingRents = async () => {

      const shopNo = localStorage.getItem('shop_no'); 
      if (!shopNo) {
        console.error('Shop number not found in local storage');
        return;
      }

      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/customer/allpendingrents?shop_no=${shopNo}`,
          { withCredentials: true }
        );
        setPendingRents(data.data || []); 
      } catch (err) {
        console.error('Failed to fetch pending rents', err);
        setPendingRents([]);
      }
    };

    if (open) {
      fetchPendingRents();
      setFormData({ method: '', rent: null }); 
      setError(null);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRentSelect = (e) => {
    const selectedId = e.target.value;
    const selectedRent = pendingRents.find((r) => r.payment_id === selectedId);
    setFormData((prev) => ({ ...prev, rent: selectedRent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const shopNo = localStorage.getItem('shop_no'); 
      if (!shopNo) {
        console.error('Shop number not found in local storage');
        return;
      }

    try {
      if (!formData.rent || !formData.method) {
        setError('Please select rent and payment method.');
        setLoading(false);
        return;
      }

      const { month_year } = formData.rent;

      const payload = {
        method: String(formData.method), 
        type: 'rent', 
        month_year: new Date(month_year).toISOString().split('T')[0], 
      };

      await axios.post(
        `http://localhost:3000/api/v1/customer/payrent?shop_no=${shopNo}`,
        payload,
        {
          headers: { Accept: 'application/json' },
          withCredentials: true,
        }
      );

      alert(`${title} payment successful!`);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
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
            {title} Payment
          </Typography>

          {error && (
            <Typography color="error" variant="body2" textAlign="center" mb={2}>
              {error}
            </Typography>
          )}

          {/* Select Rent */}
          <FormControl fullWidth required>
            <InputLabel id="rent-select-label">Select Rent</InputLabel>
            <Select
              labelId="rent-select-label"
              value={formData.rent?.payment_id || ''}
              onChange={handleRentSelect}
              label="Select Rent"
              MenuProps={{
                disablePortal: true,
                anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                transformOrigin: { vertical: 'top', horizontal: 'left' },
                PaperProps: { sx: { maxHeight: 200, zIndex: 1401 } },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#192230' },
                  '&:hover fieldset': { borderColor: '#192230' },
                  '&.Mui-focused fieldset': { borderColor: '#192230' },
                },
              }}
            >
              {pendingRents.length === 0 ? (
                <MenuItem value="" disabled>
                  No pending rents
                </MenuItem>
              ) : (
                pendingRents.map((rent) => (
                  <MenuItem key={rent.payment_id} value={rent.payment_id}>
                    Payment #{rent.payment_id} | {new Date(rent.month_year).toLocaleDateString()} | {rent.status}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Select Payment Method */}
          <FormControl fullWidth required>
            <InputLabel id="method-label">Payment Method</InputLabel>
            <Select
              labelId="method-label"
              name="method"
              value={formData.method}
              onChange={handleChange}
              label="Payment Method"
              MenuProps={{
                disablePortal: true,
                anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                transformOrigin: { vertical: 'top', horizontal: 'left' },
                PaperProps: { sx: { maxHeight: 200, zIndex: 1401 } },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#192230' },
                  '&:hover fieldset': { borderColor: '#192230' },
                  '&.Mui-focused fieldset': { borderColor: '#192230' },
                },
              }}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
            </Select>
          </FormControl>

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