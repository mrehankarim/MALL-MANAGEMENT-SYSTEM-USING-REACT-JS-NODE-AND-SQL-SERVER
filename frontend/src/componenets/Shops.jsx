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
    Button,
    Modal,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';
import axios from 'axios';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: '#0f172a',
    border: '2px solid #3B82F6',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};

const Shops = () => {
    const [shops, setShops] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [billsModalOpen, setBillsModalOpen] = useState(false);
    const [bills, setBills] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [formData, setFormData] = useState({
        storeName: '',
        shopNo: '',
        ownerUsername: '',
        category: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const shopRes = await axios.get('http://localhost:3000/api/v1/subscriber/shops', { withCredentials: true });
                const customerRes = await axios.get('http://localhost:3000/api/v1/subscriber/customers', { withCredentials: true });
                setShops(shopRes.data.data);
                setCustomers(customerRes.data.data.map(c => c.username));
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    const handleOpen = (shopNo) => {
        setFormData(prev => ({ ...prev, shopNo }));
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            storeName: '',
            shopNo: '',
            ownerUsername: '',
            category: ''
        });
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        const { storeName, shopNo, ownerUsername, category } = formData;
        if (!storeName || !shopNo || !ownerUsername || !category) {
            alert("All fields are required.");
            return;
        }
        try {
            await axios.post('http://localhost:3000/api/v1/subscriber/allocateshop', {
                storeName,
                shopNo: Number(shopNo),
                ownerUsername,
                category
            }, { withCredentials: true });

            handleClose();
            const shopRes = await axios.get('http://localhost:3000/api/v1/subscriber/shops', { withCredentials: true });
            setShops(shopRes.data.data);
        } catch (error) {
            console.error("Allocation failed:", error);
            alert("Allocation failed. Please try again.");
        }
    };

    const handleViewBills = async (shopNo) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/v1/subscriber/bills/?shop_no=${shopNo}`, { withCredentials: true });
            setBills(res.data.data || []);
            setSelectedShop(shopNo);
            setBillsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch bills:", error);
            alert("Failed to fetch bills. Please try again.");
        }
    };

    const handleCloseBillsModal = () => {
        setBillsModalOpen(false);
        setBills([]);
        setSelectedShop(null);
    };

    const filteredShops = shops.filter(shop => {
        const matchesSearch =
            shop.shop_no.toString().includes(searchTerm) ||
            shop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (shop.shopowner && shop.shopowner.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter ? shop.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 2 }}>
                Shops Overview
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    placeholder="Search shops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    sx={{ input: { color: '#f1f5f9' } }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ color: '#94a3b8' }}>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{ color: '#f1f5f9' }}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="vacant">Vacant</MenuItem>
                        <MenuItem value="occupied">Allocated</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper} sx={{ backgroundColor: "#020317", color: '#f1f5f9' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#3B82F6' }}>Shop No</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Location</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Status</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Shopowner</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Rent Amount (PKR)</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredShops.map((shop) => (
                            <TableRow key={shop.shop_no}>
                                <TableCell sx={{ color: '#f1f5f9' }}>{shop.shop_no}</TableCell>
                                <TableCell sx={{ color: '#f1f5f9' }}>{shop.location}</TableCell>
                                <TableCell sx={{ color: shop.status === 'vacant' ? '#f87171' : '#34d399' }}>
                                    {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                                </TableCell>
                                <TableCell sx={{ color: '#f1f5f9' }}>{shop.shopowner || '-'}</TableCell>
                                <TableCell sx={{ color: '#f1f5f9' }}>{shop.rent_amount?.toLocaleString() || '-'}</TableCell>
                                <TableCell>
                                    {shop.status === 'vacant' ? (
                                        <Button variant="contained" color="primary" onClick={() => handleOpen(shop.shop_no)}>
                                            Allocate
                                        </Button>
                                    ) : (
                                        <Button variant="outlined" color="info" onClick={() => handleViewBills(shop.shop_no)}>
                                            Bills
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Allocation Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" color="#f1f5f9" mb={2}>Allocate Shop</Typography>
                    <TextField
                        fullWidth
                        name="storeName"
                        label="Store Name"
                        value={formData.storeName}
                        onChange={handleChange}
                        sx={{ mb: 2, input: { color: '#f1f5f9' }, label: { color: '#94a3b8' } }}
                    />
                    <TextField
                        fullWidth
                        label="Shop No"
                        value={formData.shopNo}
                        disabled
                        sx={{ mb: 2, input: { color: '#f1f5f9' }, label: { color: '#94a3b8' } }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ color: '#94a3b8' }}>Owner Username</InputLabel>
                        <Select
                            name="ownerUsername"
                            value={formData.ownerUsername}
                            onChange={handleChange}
                            sx={{ color: '#f1f5f9' }}
                        >
                            {customers.map(username => (
                                <MenuItem key={username} value={username}>{username}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        name="category"
                        label="Category"
                        value={formData.category}
                        onChange={handleChange}
                        sx={{ mb: 2, input: { color: '#f1f5f9' }, label: { color: '#94a3b8' } }}
                    />
                    <Button variant="contained" fullWidth color="primary" onClick={handleSubmit}>Allocate</Button>
                </Box>
            </Modal>

            {/* Bills Modal */}
            <Modal open={billsModalOpen} onClose={handleCloseBillsModal}>
                <Box sx={{ ...modalStyle, width: 700 }}>
                    <Typography variant="h6" color="#f1f5f9" mb={2}>
                        Bills for Shop #{selectedShop}
                    </Typography>
                    {bills.length === 0 ? (
                        <Typography color="#f1f5f9">No bills found.</Typography>
                    ) : (
                        <TableContainer component={Paper} sx={{ backgroundColor: "#020317" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: '#3B82F6' }}>Month</TableCell>
                                        <TableCell sx={{ color: '#3B82F6' }}>Type</TableCell>
                                        <TableCell sx={{ color: '#3B82F6' }}>Amount (PKR)</TableCell>
                                        <TableCell sx={{ color: '#3B82F6' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bills.map((bill) => (
                                        <TableRow key={bill.bill_id}>
                                            <TableCell sx={{ color: '#f1f5f9' }}>{new Date(bill.month_year).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</TableCell>
                                            <TableCell sx={{ color: '#f1f5f9' }}>{bill.type}</TableCell>
                                            <TableCell sx={{ color: '#f1f5f9' }}>{bill.amount.toLocaleString()}</TableCell>
                                            <TableCell sx={{ color: bill.status === 'pending' ? '#f87171' : '#34d399' }}>
                                                {bill.status}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default Shops;
