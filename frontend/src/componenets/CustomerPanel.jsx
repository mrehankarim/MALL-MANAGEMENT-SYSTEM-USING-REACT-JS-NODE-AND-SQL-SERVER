import React, { useEffect, useState } from 'react';
import RevenueCard from './RevenueCard';
import MonthlyRevenue from './MonthlyRevenue';
import axios from 'axios';
import { Box } from '@mui/material';

const CustomerPanel = () => {
  const [totalRevenue, setTotalRevenue] = useState(0); // For total revenue
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]); // For chart data

  useEffect(() => {
    // Fetch total revenue
    const fetchTotalRevenue = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/customer/totalrevenue', {
          withCredentials: true,
        });
        // Extract total revenue from the response
        const revenue = response.data.data[0]?.total_revenue || 0;
        setTotalRevenue(revenue);
      } catch (error) {
        console.error('Error fetching total revenue:', error);
      }
    };

    // Fetch monthly revenue
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/customer/monthlyrevenue', {
          withCredentials: true,
        });
        // Extract and format monthly revenue data
        const rawData = response.data.data;
        const formattedData = rawData.map((item) => ({
          date: item.MonthYear, // Use "date" as the key for the x-axis
          value: item.MonthlyRevenue, // Use "value" as the key for the y-axis
        }));
        console.log('Formatted Monthly Revenue Data:', formattedData); // Debugging
        setMonthlyRevenueData(formattedData);
      } catch (error) {
        console.error('Error fetching monthly revenue:', error);
      }
    };

    fetchTotalRevenue();
    fetchMonthlyRevenue();
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Revenue Card for Total Revenue */}
        <RevenueCard
          title="Total Revenue"
          value={totalRevenue} // Total revenue fetched from the backend
          chartData={monthlyRevenueData} // Monthly revenue data for the chart
          growthText="Monthly Revenue Overview"
        />
      </Box>
    </>
  );
};

export default CustomerPanel;