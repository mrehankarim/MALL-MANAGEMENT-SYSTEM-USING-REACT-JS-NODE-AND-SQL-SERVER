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
    Paper
} from '@mui/material';
import axios from 'axios';

const Shops = () => {
    const [shops, setShops] = useState([]);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/subscriber/shops', {
                    withCredentials: true
                });
                setShops(response.data.data);
            } catch (error) {
                console.error("Failed to fetch shops:", error);
            }
        };
        fetchShops();
    }, []);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 2 }}>
                Shops Overview
            </Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: "#020317", color: '#f1f5f9' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#3B82F6' }}>Shop No</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Location</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Status</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Shopowner</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Rent Amount (PKR)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shops.map((shop) => (
                            <TableRow key={shop.shop_no}>
                                <TableCell sx={{ color: '#f1f5f9' }}>{shop.shop_no}</TableCell>
                                <TableCell sx={{ color: '#f1f5f9' }}>{shop.location}</TableCell>
                                <TableCell sx={{ color: shop.status === 'vacant' ? '#f87171' : '#34d399' }}>
                                    {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                                </TableCell>
                                <TableCell sx={{ color: '#f1f5f9' }}>{shop.shopowner}</TableCell>
                                <TableCell sx={{ color: '#f1f5f9' }}>
                                    {shop.rent_amount.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Shops;
