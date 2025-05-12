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

const StoreBills = () => {
    const [bills, setBills] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {

        const shopNo = localStorage.getItem('shop_no'); // Retrieve shop_no from local storage
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
                setFilteredBills(response.data.data); // Initial list
            } catch (error) {
                console.error('Error fetching bills:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.trim() === '') {
                setFilteredBills(bills);
            } else {
                const filtered = bills.filter((bill) =>
                    bill.shop_no.toString().includes(search)
                );
                setFilteredBills(filtered);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, bills]);

    const theme = useTheme();

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