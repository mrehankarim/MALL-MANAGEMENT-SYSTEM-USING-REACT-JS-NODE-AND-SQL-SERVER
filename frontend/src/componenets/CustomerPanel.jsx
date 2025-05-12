import React, { useEffect, useState } from 'react';
import RevenueCard from './RevenueCard';
import PendingAmountCard from './PendingAmountCard';
import InsertStoreRevenueCard from './InsertRevenueCard';
import AddFeedbackCard from './AddFeedbackCard';
import axios from 'axios';
import { Box } from '@mui/material';

const CustomerPanel = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [pendingRent, setPendingRent] = useState(0);
  const [pendingBills, setPendingBills] = useState(0);

  useEffect(() => {
    const shopNo = localStorage.getItem('shop_no'); // Retrieve shop_no from local storage

    if (!shopNo) {
      console.error('Shop number not found in local storage');
      return;
    }

    const fetchTotalRevenue = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/customer/totalrevenue?shop_no=${shopNo}`,
          { withCredentials: true }
        );
        const revenue = response.data.data[0]?.total_revenue || 0;
        setTotalRevenue(revenue);
      } catch (error) {
        console.error('Error fetching total revenue:', error);
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/customer/monthlyrevenue?shop_no=${shopNo}`,
          { withCredentials: true }
        );
        const rawData = response.data.data;
        const formattedData = rawData.map((item) => ({
          date: item.MonthYear,
          value: item.MonthlyRevenue,
        }));
        setMonthlyRevenueData(formattedData);
      } catch (error) {
        console.error('Error fetching monthly revenue:', error);
      }
    };

    const fetchPendingRent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/customer/activerents?shop_no=${shopNo}`,
          { withCredentials: true }
        );
        const rentAmount = response.data.data[0]?.amount || 0;
        setPendingRent(rentAmount);
      } catch (error) {
        console.error('Error fetching pending rent:', error);
      }
    };

    const fetchPendingBills = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/customer/bills?shop_no=${shopNo}`,
          { withCredentials: true }
        );
        const billAmount = response.data.data[0]?.amount || 0;
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
      {/* Top row: Revenue and Pending Cards */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <RevenueCard
          title="Total Store Revenue"
          value={totalRevenue}
          chartData={monthlyRevenueData}
          growthText="Monthly Revenue Overview"
        />

        <PendingAmountCard title="Pending Rent" value={pendingRent} />
        <PendingAmountCard title="Pending Utility Bills" value={pendingBills} />
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <InsertStoreRevenueCard />
        <AddFeedbackCard />
      </Box>
    </>
  );
};

export default CustomerPanel;