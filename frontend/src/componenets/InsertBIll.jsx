import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import axios from 'axios';

const InsertBill = ({ setRevenue }) => {
  const [shopNo, setShopNo] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [monthYear, setMonthYear] = useState('');
  const [shops, setShops] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch occupied shops from API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/api/v1/subscriber/shops', {
          withCredentials: true,
        });
        setShops(res.data.data.filter(shop => shop.status === 'occupied'));
      } catch (error) {
        console.error('Failed to fetch shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if ([shopNo, type, amount, monthYear].some(field => String(field).trim() === "")) {
  setError("All fields are required");
  return;
}


    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/subscriber/add/bill',
        { shop_no: shopNo, type, amount, month_year: monthYear },
        { withCredentials: true }
      );
      setRevenue(false);
      alert('Revenue added successfully!');
    } catch (error) {
      console.error('Failed to add revenue:', error);
      setError('Failed to add revenue. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 3, padding: 3, backgroundColor: "#020317", borderRadius: 2, color: '#f1f5f9' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#3B82F6' }}>Add Revenue</Typography>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={150}>
          <CircularProgress sx={{ color: '#3B82F6' }} />
        </Box>
      ) : (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#f1f5f9' }}>Shop No</InputLabel>
            <Select
              value={shopNo}
              onChange={(e) => setShopNo(e.target.value)}
              label="Shop No"
              sx={{ backgroundColor: '#020317', color: '#f1f5f9' }}
            >
              <MenuItem value="">Select Shop</MenuItem>
              {shops.map(shop => (
                <MenuItem key={shop.shop_no} value={shop.shop_no}>{shop.shop_no}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#f1f5f9' }}>Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Type"
              sx={{ backgroundColor: '#020317', color: '#f1f5f9' }}
            >
              <MenuItem value="">Select Type</MenuItem>
              <MenuItem value="electricity">Electricity</MenuItem>
              <MenuItem value="water">Water</MenuItem>
              <MenuItem value="gas">Gas</MenuItem>
              <MenuItem value="internet">Internet</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Amount (PKR)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            sx={{ mb: 2, input: { color: '#f1f5f9' }, label: { color: '#f1f5f9' } }}
          />

          <TextField
            label="Month/Year"
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
            fullWidth
            sx={{ mb: 2, input: { color: '#f1f5f9' }, label: { color: '#f1f5f9' } }}
          />

          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit} 
            fullWidth 
            sx={{ backgroundColor: '#3B82F6', color: '#f1f5f9', '&:hover': { backgroundColor: '#2563EB' } }}
          >
            Add Revenue
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => setRevenue(false)} 
            fullWidth 
            sx={{ mt: 1, color: '#f1f5f9', borderColor: '#3B82F6', '&:hover': { borderColor: '#2563EB', color: '#2563EB' } }}
          >
            Cancel
          </Button>
        </>
      )}
    </Box>
  );
};

export default InsertBill;
