import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/subscriber/customers', {
          withCredentials: true
        });
        setCustomers(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 2 }}>
        Customers
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={150}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: "#020317" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#3B82F6' }}>Username</TableCell>
                <TableCell sx={{ color: '#3B82F6' }}>Email</TableCell>
                <TableCell sx={{ color: '#3B82F6' }}>First Name</TableCell>
                <TableCell sx={{ color: '#3B82F6' }}>Last Name</TableCell>
                <TableCell sx={{ color: '#3B82F6' }}>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: '#f1f5f9' }}>{customer.username}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}>{customer.email}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}>{customer.lname}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}>{customer.fname}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9', textTransform: 'capitalize' }}>
                    {customer.role.replace('_', ' ')}
                  </TableCell>
                </TableRow>
              ))}
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: '#f87171' }}>
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Customers;
