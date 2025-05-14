import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, CircularProgress
} from '@mui/material';

const MonthlyRentList = () => {
  const [filteredRents, setFilteredRents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFilteredRents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/subscriber/monthlyrent', {
        withCredentials: true,
      });

      const filtered = response.data.data
        .filter(entry =>
          entry.status.includes("pending") || entry.status.includes("paid")
        )
        .map(entry => ({
          ...entry,
          filteredStatus: entry.status.filter(status => status !== "occupied"),
        }));

      setFilteredRents(filtered);
    } catch (error) {
      console.error('Error fetching rent data:', error);
      alert('Failed to load rent data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredRents();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Rent Status
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="filtered rent table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Payment ID</strong></TableCell>
              <TableCell><strong>Shop No</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Owner</strong></TableCell>
              <TableCell><strong>Month</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Transaction ID</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRents.map((entry) => (
              <TableRow key={entry.payment_id}>
                <TableCell>{entry.payment_id}</TableCell>
                <TableCell>{entry.shop_no[0]}</TableCell>
                <TableCell>{entry.location}</TableCell>
                <TableCell>{entry.shopowner}</TableCell>
                <TableCell>{new Date(entry.month_year).toLocaleDateString()}</TableCell>
                <TableCell>{entry.filteredStatus.join(', ') || 'N/A'}</TableCell>
                <TableCell>{entry.transaction_id || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MonthlyRentList;
