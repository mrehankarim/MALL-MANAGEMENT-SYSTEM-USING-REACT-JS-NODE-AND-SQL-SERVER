import React, { useEffect, useState } from 'react'
import RevenueCard from './RevenueCard'
import MonthlyRevenue from './MonthlyRevenue'
import axios from 'axios'
import { Box } from '@mui/material'
const AdminPanel = () => {
  const [revenue,setRevenue]=useState(0)
  const [monthlyRevenue,setMonthlyRevenue]=useState({})
  const[rawRevenue,setRawRevenue]=useState([])
  useEffect(()=>{

    async  function getRevenue()
    {
      try {
        const response=await axios.get('http://localhost:3000/api/v1/admin/totalrevenue',{
          withCredentials:true
        })
        setRevenue(response.data.data.revenue)
        
      } catch (error) {
        console.log("Error fetching revenue")
        
      }
    }
    async function getMonthlyRevenue() {
      const response=await axios.get("http://localhost:3000/api/v1/admin/monthlyrevenue",{
        withCredentials:true
      })
      let data=response.data.data
      setRawRevenue(data)
    const newdata=data.map((item)=>{
      return {value:item.totalSales}
    })
    setMonthlyRevenue(newdata)
    }
    getRevenue()
    getMonthlyRevenue()
  },[])

  const formatMonthlyRevenue = (rawData) => {
    const sorted = [...rawData].sort((a, b) => {
      if (a.YEAR !== b.YEAR) return b.YEAR - a.YEAR;
      return b.Month - a.Month;
    });
    const monthNames = [
      '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const formatted = sorted.slice(0, 9).map(item => ({
      month: `${monthNames[item.Month]} '${String(item.YEAR).slice(2)}`, // e.g., Jan '24
      revenue: item.totalSales
    }));
    return formatted.reverse();
  };
  const formattedReveue=formatMonthlyRevenue(rawRevenue)
  return (
    <>
    <Box sx={{ display: 'flex', gap: 3 }}>
      <RevenueCard
        title="Total Revenue"
        value={revenue}
        chartData={monthlyRevenue}
        growthText="monthly revenue"
      />
      <Box sx={{ flexGrow: 1, height: 260 }}>
        <MonthlyRevenue title="Monthly Revenue" chartData={formattedReveue} />
      </Box>
    </Box>

    </>
  )
}

export default AdminPanel
