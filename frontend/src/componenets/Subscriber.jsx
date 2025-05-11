import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios"
import { useTheme } from '@emotion/react';
import { Box, TextField } from '@mui/material';

const Subscriber = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/admin/activesubscribers', {
                    headers: {            
                        'Accept': 'application/json',
                    },
                    withCredentials:true
                });
                setSubscriptions(response.data.data);
                setFilteredSubscriptions(response.data.data); // initial list
            } catch (error) {
                console.error('Error fetching subscribers:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.trim() === "") {
                setFilteredSubscriptions(subscriptions);
            } else {
                const filtered = subscriptions.filter((sub) =>
                    sub.mallowner_username.toLowerCase().includes(search.toLowerCase())
                );
                setFilteredSubscriptions(filtered);
            }
        }, 300); 

        return () => clearTimeout(timeout);
    }, [search, subscriptions]);

    const theme = useTheme();

    return (
        <>
            <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                sx={{
                    width: '400px',
                    mb: "10px",
                    display: 'flex',
                    justifyContent: 'flex-end',
                    ml: 'auto',
                    '& MuiInputLabel':
                    {
                        color:"white",
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
                placeholder='Search by username'
            />

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 1,
                    borderColor: "#192230",
                    borderWidth: "0.2px",
                    p: 2,
                    backgroundColor: "#000309",
                    boxShadow: "0 0 0 1px #1e293b",
                }}
            >
                <Table sx={{ minWidth: 650 }} size="small" aria-label="subscriptions table">
                    <TableHead>
                        <TableRow sx={{ borderBottom: "1px solid #1e293b" }}>
                            <TableCell sx={{ color: "#94a3b8" }}>ID</TableCell>
                            <TableCell align="right" sx={{ color: "#94a3b8" }}>Username</TableCell>
                            <TableCell align="right" sx={{ color: "#94a3b8" }}>Start Date</TableCell>
                            <TableCell align="right" sx={{ color: "#94a3b8" }}>End Date</TableCell>
                            <TableCell align="right" sx={{ color: "#94a3b8" }}>Subscription Fee</TableCell>
                            <TableCell align="right" sx={{ color: "#94a3b8" }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSubscriptions.map((subscription, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    borderBottom: "1px solid #1e293b",
                                    '&:hover': { backgroundColor: "#1e293b" },
                                }}
                            >
                                <TableCell sx={{ color: "#e2e8f0" }}>{subscription.subscription_id}</TableCell>
                                <TableCell align="right" sx={{ color: "#e2e8f0" }}>{subscription.mallowner_username}</TableCell>
                                <TableCell align="right" sx={{ color: "#e2e8f0" }}>{subscription.start_date.split("T")[0]}</TableCell>
                                <TableCell align="right" sx={{ color: "#e2e8f0" }}>{subscription.end_date.split("T")[0]}</TableCell>
                                <TableCell align="right" sx={{ color: "#e2e8f0" }}>${subscription.amount}</TableCell>
                                <TableCell align="right">
                                    <Box
                                        sx={{
                                            display: "inline-block",
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: "999px",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            backgroundColor: "#3B82F6",
                                            color: "#0f172a",
                                        }}
                                    >
                                        {subscription.status}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default Subscriber;
