import React, { useEffect, useState } from 'react';
import RevenueCard from './RevenueCard';
import PendingAmountCard from './PendingAmountCard'; // Import the PendingAmountCard component
import axios from 'axios';
import { Box } from '@mui/material';

const CustomerPanel = () => {
  const [totalRevenue, setTotalRevenue] = useState(0); // For total revenue
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]); // For chart data
  const [pendingRent, setPendingRent] = useState(0); // For pending rent
  const [pendingBills, setPendingBills] = useState(0); // For pending utility bills

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
        setMonthlyRevenueData(formattedData);
      } catch (error) {
        console.error('Error fetching monthly revenue:', error);
      }
    };

    // Fetch pending rent
    const fetchPendingRent = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/customer/activerents', {
          withCredentials: true,
        });
        // Extract pending rent amount from the response
        const rentAmount = response.data.data[0]?.rent_amount || 0;
        setPendingRent(rentAmount);
      } catch (error) {
        console.error('Error fetching pending rent:', error);
      }
    };

    // Fetch pending utility bills
    const fetchPendingBills = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/customer/bills', {
        withCredentials: true,
        });
        console.log('Pending Bills Response:', response.data); // Debugging
        const billAmount = response.data.data[0]?.amount || 0;
        console.log('Extracted Bill Amount:', billAmount); // Debugging
        setPendingBills(billAmount);
    } catch (error) {
        console.error('Error fetching pending bills:', error);
    }
    };

    fetchTotalRevenue();
    fetchMonthlyRevenue();
    fetchPendingRent();
    fetchPendingBills();
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Revenue Card for Total Revenue */}
        <RevenueCard
          title="Total Store Revenue"
          value={totalRevenue} // Total revenue fetched from the backend
          chartData={monthlyRevenueData} // Monthly revenue data for the chart
          growthText="Monthly Revenue Overview"
        />

        {/* Pending Rent Card */}
        <PendingAmountCard
          title="Pending Rent"
          value={pendingRent} // Pending rent fetched from the backend
        />

        {/* Pending Utility Bills Card */}
        <PendingAmountCard
          title="Pending Utility Bills"
          value={pendingBills} // Pending utility bills fetched from the backend
        />
      </Box>
    </>
  );
};

export default CustomerPanel;