import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminPanel = () => {
    const [revenue, setRevenue] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState({});
    const [rawRevenue, setRawRevenue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscriptions, setSubscriptions] = useState([]);
    const [deactivated, setDeactivated] = useState([]);
    const [newThisMonth, setNewThisMonth] = useState(0);  // Added state for New This Month
    let thismonth = [];

    useEffect(() => {
        // Fetch total revenue
        async function getRevenue() {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/admin/totalrevenue', {
                    withCredentials: true
                });
                setRevenue(response.data.data.revenue);
            } catch (error) {
                console.log("Error fetching revenue");
            }
        }

        // Fetch monthly revenue
        async function getMonthlyRevenue() {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/admin/monthlyrevenue', {
                    withCredentials: true
                });
                const data = response.data.data;
                setRawRevenue(data);
                const newData = data.map((item) => ({ value: item.totalSales }));
                setMonthlyRevenue(newData);
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.log("Error fetching monthly revenue");
            }
        }

        // Fetch subscriptions data
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/admin/subscribers', {
                    headers: { 'Accept': 'application/json' },
                    withCredentials: true
                });
                setSubscriptions(response.data.data);

                const deactivatedTemp = response.data.data.filter((subscription) => {
                    return subscription.status === "expired";  // Correct comparison
                });
                setDeactivated(deactivatedTemp);

                // Logic for "New This Month"
                const currentMonth = new Date().getMonth(); // Get current month (0-11)
                const currentYear = new Date().getFullYear(); // Get current year

                // Filter subscriptions created in the current month based on the start_date
                const newThisMonthCount = response.data.data.filter((subscription) => {
                    const startDate = new Date(subscription.start_date);  // Assuming start_date exists
                    return startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
                }).length;

                setNewThisMonth(newThisMonthCount); // Set the count of new subscriptions for this month

            } catch (error) {
                console.error('Error fetching subscribers:', error);
            }
        };

        // Fetch data
        getRevenue();
        getMonthlyRevenue();
        fetchData();
    }, []);

    // Format monthly revenue data
    const formatMonthlyRevenue = (rawData) => {
        const sorted = [...rawData].sort((a, b) => {
            if (a.YEAR !== b.YEAR) return b.YEAR - a.YEAR;
            return b.Month - a.Month;
        });
        const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const formatted = sorted.slice(0, 9).map((item) => ({
            month: `${monthNames[item.Month]} '${String(item.YEAR).slice(2)}`,
            revenue: item.totalSales
        }));
        return formatted.reverse();
    };

    const formattedRevenue = formatMonthlyRevenue(rawRevenue);

    return (
        <>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                    <Card sx={{ minWidth: 200, backgroundColor: "#020317", color: '#f1f5f9' }}>
                        <CardContent>
                            <Typography variant="h6">Revenue</Typography>
                            <Typography variant="h4" sx={{ color: "#3B82F6" }}>${revenue}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: 200, backgroundColor: "#020317", color: '#f1f5f9' }}>
                        <CardContent>
                            <Typography variant="h6">Active Subscriptions</Typography>
                            <Typography variant="h4" sx={{ color: "#3B82F6" }}>{subscriptions.length - deactivated.length}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: 200, backgroundColor: "#020317", color: '#f1f5f9' }}>
                        <CardContent>
                            <Typography variant="h6">New This Month</Typography>
                            <Typography variant="h4" sx={{ color: "#3B82F6" }}>{newThisMonth}</Typography> {/* Displaying new this month */}
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: 200, backgroundColor: "#020317", color: '#f1f5f9' }}>
                        <CardContent>
                            <Typography variant="h6">Deactivated Subscribers</Typography>
                            <Typography variant="h4" sx={{ color: "#3B82F6" }}>{deactivated.length}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Adding Line Chart for Revenue Trend */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Revenue Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formattedRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#3B82F6" />
                    </LineChart>
                </ResponsiveContainer>
            </Box>

            {/* Adding Histogram (Bar Chart) for Monthly Revenue */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Monthly Revenue Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formattedRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </>
    );
};

export default AdminPanel;
