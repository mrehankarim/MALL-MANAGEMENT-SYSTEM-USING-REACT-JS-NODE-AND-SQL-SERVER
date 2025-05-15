import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import axios from 'axios';

const OwnerExpenseCard = () => {
    const [revenue, setRevenue] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/subscriber/expense/?date=${today}`, {
                    withCredentials: true
                });
                setRevenue(res.data?.data[0].total_expenses || 0);

            } catch (error) {
                console.error("Failed to fetch revenue:", error);
                setRevenue(0);
            } finally {
                setLoading(false);
            }
        };

        fetchRevenue();
    }, [today]);

    return (
        <Card sx={{ backgroundColor: '#0f172a', color: '#f1f5f9', border: '1px solid #3B82F6', borderRadius: 2,mt:3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#3B82F6' }}>
                    This month Expense
                </Typography>
                <Box sx={{ fontSize: 24, fontWeight: 'bold' }}>
                    {loading ? 'Loading...' : `PKR ${revenue.toLocaleString()}`}
                </Box>
            </CardContent>
        </Card>
    );
};

export default OwnerExpenseCard;
