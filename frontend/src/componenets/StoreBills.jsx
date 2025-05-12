import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useTheme } from '@emotion/react';
import { Box, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const StoreBills = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const shopNo = localStorage.getItem('shop_no');
    if (!shopNo) {
      console.error('Shop number not found in local storage');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/customer/allbills?shop_no=${shopNo}`, {
          headers: {
            Accept: 'application/json',
          },
          withCredentials: true,
        });
        setBills(response.data.data);
        setFilteredBills(response.data.data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let filtered = bills;

      if (search.trim() !== '') {
        filtered = filtered.filter((bill) =>
          formatDate(bill.month_year).includes(search)
      )}

      if (filterStatus !== 'all') {
        filtered = filtered.filter((bill) => bill.status === filterStatus);
      }

      if (filterType !== 'all') {
        filtered = filtered.filter((bill) => bill.type === filterType);
      }

      setFilteredBills(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, filterStatus, filterType, bills]);

  const theme = useTheme();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      {/* Search and Filter Controls */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          gap: 2,
        }}
      >
        {/* Search by Date - stays on the left */}
        <TextField
          id="outlined-basic"
          label="Search by Date (DD/MM/YYYY)"
          variant="outlined"
          sx={{
            width: '400px',
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#192230' },
              '&:hover fieldset': { borderColor: '#192230' },
              '&.Mui-focused fieldset': { borderColor: '#192230' },
            },
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by date"
        />

        {/* Filter controls container - aligned to the right */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Filter by Type */}
          <FormControl
            variant="outlined"
            sx={{
              width: '200px',
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#192230' },
                '&:hover fieldset': { borderColor: '#192230' },
                '&.Mui-focused fieldset': { borderColor: '#192230' },
              },
            }}
          >
            <InputLabel id="filter-type-label">Filter by Type</InputLabel>
            <Select
              labelId="filter-type-label"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Filter by Type"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="electricity">Electricity</MenuItem>
              <MenuItem value="internet">Internet</MenuItem>
              <MenuItem value="water">Water</MenuItem>
              <MenuItem value="gas">Gas</MenuItem>
            </Select>
          </FormControl>

          {/* Filter by Status */}
          <FormControl
            variant="outlined"
            sx={{
              width: '200px',
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#192230' },
                '&:hover fieldset': { borderColor: '#192230' },
                '&.Mui-focused fieldset': { borderColor: '#192230' },
              },
            }}
          >
            <InputLabel id="filter-status-label">Filter by Status</InputLabel>
            <Select
              labelId="filter-status-label"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table - remains unchanged */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 1,
          borderColor: '#192230',
          borderWidth: '0.2px',
          p: 2,
          backgroundColor: '#000309',
          boxShadow: '0 0 0 1px #1e293b',
        }}
      >
        <Table sx={{ minWidth: 650 }} size="small" aria-label="bills table">
          <TableHead>
            <TableRow sx={{ borderBottom: '1px solid #1e293b' }}>
              <TableCell sx={{ color: '#94a3b8' }}>Bill ID</TableCell>
              <TableCell align="right" sx={{ color: '#94a3b8' }}>Shop No</TableCell>
              <TableCell align="right" sx={{ color: '#94a3b8' }}>Type</TableCell>
              <TableCell align="right" sx={{ color: '#94a3b8' }}>Amount</TableCell>
              <TableCell align="right" sx={{ color: '#94a3b8' }}>Month/Year</TableCell>
              <TableCell align="right" sx={{ color: '#94a3b8' }}>Status</TableCell>
              <TableCell align="right" sx={{ color: '#94a3b8' }}>Transaction ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBills.map((bill, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  borderBottom: '1px solid #1e293b',
                  '&:hover': { backgroundColor: '#1e293b' },
                }}
              >
                <TableCell sx={{ color: '#e2e8f0' }}>{bill.bill_id}</TableCell>
                <TableCell align="right" sx={{ color: '#e2e8f0' }}>{bill.shop_no}</TableCell>
                <TableCell align="right" sx={{ color: '#e2e8f0' }}>{bill.type}</TableCell>
                <TableCell align="right" sx={{ color: '#e2e8f0' }}>{bill.amount}</TableCell>
                <TableCell align="right" sx={{ color: '#e2e8f0' }}>
                  {formatDate(bill.month_year)}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: bill.status === 'paid' ? '#00fa25' : '#FF0000',
                      color: '#0f172a',
                    }}
                  >
                    {bill.status}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: '#e2e8f0' }}>
                  {bill.transaction_id ? bill.transaction_id : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default StoreBills;