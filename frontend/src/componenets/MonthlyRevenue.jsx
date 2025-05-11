import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  CartesianGrid,
} from 'recharts';

const MonthlyRevenue = ({ title, chartData }) => {
  const total = chartData.reduce((acc, item) => acc + item.revenue, 0);
  return (
    <Card
      sx={{
        borderRadius: '20px',
        backgroundColor: '#020317',
        color: '#f1f5f9',
        width: '100%',
        maxWidth: 500,
        px: 3,
        py: 2,
        boxShadow: '0 0 0 1px #1e293b',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 0.5 }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, fontSize: '2rem', mb: 1 }}
        >
          ${total.toLocaleString()}
        </Typography>
      </CardContent>

      <Box sx={{ height: 160, px: 0.5 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#cbd5e1"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.75rem',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#f1f5f9' }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar
              dataKey="revenue"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default MonthlyRevenue;
