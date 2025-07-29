import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from '@mui/material';
import { AttachMoney as RevenueIcon, TrendingUp as TrendIcon } from '@mui/icons-material';
import axios from 'axios';

const RevenueCard = () => {
    const [revenue, setRevenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trend, setTrend] = useState(0);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/subscriber/revenue/?date=${today}`, {
                    withCredentials: true
                });
                const currentRevenue = res.data?.data[0].total_revenue || 0;
                setRevenue(currentRevenue);
                setTrend(currentRevenue > 50000 ? 1 : currentRevenue < 30000 ? -1 : 0);
            } catch (error) {
                console.error("Failed to fetch revenue:", error);
                setRevenue(0);
                setTrend(0);
            } finally {
                setLoading(false);
            }
        };
        fetchRevenue();
    }, [today]);

    return (
        <Card sx={{ 
            backgroundColor: 'background.paper',
            color: 'text.primary',
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
            transition: 'all 0.3s ease',
            height: '100%',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 24px rgba(59, 130, 246, 0.15)'
            },
            position: 'relative',
            overflow: 'visible',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                borderRadius: '8px 8px 0 0'
            }
        }}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{
                        backgroundColor: 'primary.light',
                        borderRadius: '50%',
                        p: 1,
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <RevenueIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Monthly Revenue
                    </Typography>
                </Box>
                
                {loading ? (
                    <LinearProgress color="primary" />
                ) : (
                    <>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'primary.dark' }}>
                            PKR {revenue.toLocaleString()}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={2}>
                            <Chip 
                                icon={<TrendIcon sx={{ 
                                    transform: trend === -1 ? 'rotate(180deg)' : 'none'
                                }} />}
                                label={trend === 1 ? 'Up from last month' : trend === -1 ? 'Down from last month' : 'Steady'}
                                color={trend === 1 ? 'success' : trend === -1 ? 'error' : 'default'}
                                variant="outlined"
                                sx={{ 
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: trend === 1 ? 'success.main' : trend === -1 ? 'error.main' : 'divider',
                                    backgroundColor: trend === 1 ? 'rgba(34, 197, 94, 0.1)' : 
                                        trend === -1 ? 'rgba(239, 68, 68, 0.1)' : 'action.hover'
                                }}
                            />
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default RevenueCard;