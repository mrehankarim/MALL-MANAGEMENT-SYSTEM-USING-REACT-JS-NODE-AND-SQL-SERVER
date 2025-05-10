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
import { Box, TextField } from '@mui/material';

const StoreRent = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/customer/allrents', {
                    headers: {
                        Accept: 'application/json',
                    },
                    withCredentials: true,
                });
                setPayments(response.data.data);
                setFilteredPayments(response.data.data); // Initial list
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.trim() === '') {
                setFilteredPayments(payments);
            } else {
                const filtered = payments.filter((payment) =>
                    payment.shop_no.toString().includes(search)
                );
                setFilteredPayments(filtered);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, payments]);

    const theme = useTheme();

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                sx={{
                    width: '400px',
                    mb: '10px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    ml: 'auto',
                    '& MuiInputLabel': {
                        color: 'white',
                    },
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
                placeholder="Search by shop number"
            />

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
                <Table sx={{ minWidth: 650 }} size="small" aria-label="payments table">
                    <TableHead>
                        <TableRow sx={{ borderBottom: '1px solid #1e293b' }}>
                            <TableCell sx={{ color: '#94a3b8' }}>Payment ID</TableCell>
                            <TableCell align="right" sx={{ color: '#94a3b8' }}>Shop No</TableCell>
                            <TableCell align="right" sx={{ color: '#94a3b8' }}>Month/Year</TableCell>
                            <TableCell align="right" sx={{ color: '#94a3b8' }}>Status</TableCell>
                            <TableCell align="right" sx={{ color: '#94a3b8' }}>Transaction ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPayments.map((payment, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    borderBottom: '1px solid #1e293b',
                                    '&:hover': { backgroundColor: '#1e293b' },
                                }}
                            >
                                <TableCell sx={{ color: '#e2e8f0' }}>{payment.payment_id}</TableCell>
                                <TableCell align="right" sx={{ color: '#e2e8f0' }}>{payment.shop_no}</TableCell>
                                <TableCell align="right" sx={{ color: '#e2e8f0' }}>
                                    {formatDate(payment.month_year)}
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
                                            backgroundColor: payment.status === 'paid' ? '#00fa25' : '#FF0000',
                                            color: '#0f172a',
                                        }}
                                    >
                                        {payment.status}
                                    </Box>
                                </TableCell>
                                <TableCell align="right" sx={{ color: '#e2e8f0' }}>
                                    {payment.transaction_id ? payment.transaction_id : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default StoreRent;