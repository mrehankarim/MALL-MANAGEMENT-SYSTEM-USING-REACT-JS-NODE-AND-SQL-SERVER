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
    bill: null, 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingBills, setPendingBills] = useState([]);

  useEffect(() => {
    const shopNo = localStorage.getItem('shop_no'); 
      if (!shopNo) {
        console.error('Shop number not found in local storage');
        return;
      }

    const fetchPendingBills = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/customer/allpendingbills?shop_no=${shopNo}`,
          { withCredentials: true }
        );
        setPendingBills(data.data || []);
      } catch (err) {
        console.error('Failed to fetch pending bills', err);
        setPendingBills([]);
      }
    };

    if (open) {
      fetchPendingBills();
      setFormData({ method: '', bill: null }); 
      setError(null);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillSelect = (e) => {
    const selectedId = e.target.value;
    const selectedBill = pendingBills.find((b) => b.bill_id === selectedId);
    setFormData((prev) => ({ ...prev, bill: selectedBill }));
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
      if (!formData.bill || !formData.method) {
        setError('Please select a bill and payment method.');
        setLoading(false);
        return;
      }

      const { amount, type, month_year } = formData.bill;

      const payload = {
        amount: parseFloat(amount).toFixed(2), 
        type: 'bill', 
        bill_type: type,
        method: String(formData.method), 
        month_year: new Date(month_year).toISOString().split('T')[0],
      };

      await axios.post(
        `http://localhost:3000/api/v1/customer/paybill?shop_no=${shopNo}`,
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
            width: 500,
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

          {/* 🔄 Select Bill - updated to track full bill object */}
          <FormControl fullWidth required>
            <InputLabel id="bill-select-label">Select Bill</InputLabel>
            <Select
              labelId="bill-select-label"
              value={formData.bill?.bill_id || ''}
              onChange={handleBillSelect}
              label="Select Bill"
              MenuProps={{
                disablePortal: true,
                anchorOrigin: { horizontal: 'left' },
                transformOrigin: { horizontal: 'left' },
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
              {pendingBills.length === 0 ? (
                <MenuItem value="" disabled>
                  No pending bills
                </MenuItem>
              ) : (
                pendingBills.map((bill) => (
                  <MenuItem key={bill.bill_id} value={bill.bill_id}>
                    #{bill.bill_id} | {bill.type} | Rs. {bill.amount} |{' '}
                    {new Date(bill.month_year).toLocaleDateString()}
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
                anchorOrigin: { horizontal: 'left' },
                transformOrigin: {  horizontal: 'left' },
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

          {/* Extra instructions per method */}
          {formData.method === 'cash' && (
            <Typography variant="body2" color="text.secondary">
              Pay directly at the counter. Receipt will be issued manually.
            </Typography>
          )}
          {formData.method === 'credit_card' && (
            <Typography variant="body2" color="text.secondary">
              Use your card at POS terminal: Machine ID 45321X
            </Typography>
          )}
          {formData.method === 'bank_transfer' && (
            <Typography variant="body2" color="text.secondary">
              Bank Name: XYZ Bank<br />
              A/C Number: 1234567890<br />
              IFSC Code: XYZB0001234
            </Typography>
          )}
          {formData.method === 'UPI' && (
            <Typography variant="body2" color="text.secondary">
              Send to UPI ID: rentpay@xyz<br />
              Use transaction ID as reference.
            </Typography>
          )}

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
