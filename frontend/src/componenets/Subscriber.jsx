import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Box, TextField, Modal, Button, Typography
} from '@mui/material';
import axios from "axios";

const Subscriber = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const fetchRevenueBySubscriber = async (username) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/admin/revenuebysubsciber?username=${username}`, {
                headers: { 'Accept': 'application/json' },
                withCredentials: true
            });
            const data = response.data.data;
            if (data.length !== 0) {
                setTotalRevenue(data[0].totalSales);
                setSelectedUsername(username);
                setOpenModal(true);
            }
        } catch (error) {
            console.log("Error fetching revenue");
        }
    };

    const deactivate = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/admin/deactivate/${id}`, {
                withCredentials: true,
            });
            if (response.status === 200) {
                const filtered = subscriptions.filter((s) => s.subscription_id !== id);
                setSubscriptions(filtered);
                setFilteredSubscriptions(filtered);
                alert(`Deactivated subscriber with id: ${id}`);
            } else {
                alert("Failed to deactivate subscriber.");
            }
        } catch (error) {
            console.error("Error", error);
            alert("Failed");
        }
    };

    const clearFilters = () => {
        setSearch("");
        setStartDate("");
        setEndDate("");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/admin/activesubscribers', {
                    headers: { 'Accept': 'application/json' },
                    withCredentials: true
                });
                setSubscriptions(response.data.data);
                setFilteredSubscriptions(response.data.data);
            } catch (error) {
                console.error('Error fetching subscribers:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            let filtered = subscriptions;

            if (search.trim() !== "") {
                filtered = filtered.filter(sub =>
                    sub.mallowner_username.toLowerCase().includes(search.toLowerCase())
                );
            }

            if (startDate) {
                filtered = filtered.filter(sub =>
                    new Date(sub.start_date) >= new Date(startDate)
                );
            }

            if (endDate) {
                filtered = filtered.filter(sub =>
                    new Date(sub.end_date) <= new Date(endDate)
                );
            }

            setFilteredSubscriptions(filtered);
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, startDate, endDate, subscriptions]);

    const handleCloseModal = () => {
        setOpenModal(false);
        setTotalRevenue(0);
    };

    return (
        <>
            <Box display="flex" justifyContent="flex-end" gap={2} mb={1}>
                <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, width: 180 }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, width: 180 }}
                />
                <TextField
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Search by username'
                    sx={{
                        width: '300px',
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#192230' },
                            '&:hover fieldset': { borderColor: '#192230' },
                            '&.Mui-focused fieldset': { borderColor: '#192230' },
                        },
                        input: { color: 'white' }
                    }}
                />
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearFilters}
                    sx={{ height: "100%", alignSelf: "center" }}
                >
                    Clear Filters
                </Button>
            </Box>

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
                            <TableCell align="center" sx={{ color: "#94a3b8" }}>Actions</TableCell>
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
                                <TableCell align="right">
                                    <Box
                                        component="button"
                                        sx={{
                                            backgroundColor: "#14b8a6",
                                            color: "#0f172a",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: "999px",
                                            border: "none",
                                            cursor: "pointer",
                                            '&:hover': {
                                                backgroundColor: "#0d9488",
                                            },
                                        }}
                                        onClick={() => fetchRevenueBySubscriber(subscription.mallowner_username)}
                                    >
                                        Revenue
                                    </Box>

                                    <Box
                                        component="button"
                                        sx={{
                                            backgroundColor: "#da1d1d",
                                            color: "white",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: "999px",
                                            border: "none",
                                            cursor: "pointer",
                                            '&:hover': {
                                                backgroundColor: "#000000",
                                            },
                                        }}
                                        onClick={() => deactivate(subscription.subscription_id)}
                                    >
                                        deactivate
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: "white",
                        padding: 4,
                        borderRadius: '8px',
                        borderColor: "#3a3845",
                        boxShadow: 24,
                        width: '400px',
                        color: "black"
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        Revenue for {selectedUsername}
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        Total Revenue: ${totalRevenue}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleCloseModal}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default Subscriber;
