import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const RevenueCard = ({ title, value, growthText, chartData }) => {
  return (
    <Card
      sx={{
        borderRadius: '20px',
        backgroundColor: '#020317', // Very dark blue
        color: '#f1f5f9',
        width: '100%',
        maxWidth: 320,
        p: 2,
        boxShadow: '0 0 0 1px #1e293b',
      }}
    >
      <CardContent sx={{ pb: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 0.5 }}
        >
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          ${value}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#60a5fa', fontSize: '0.75rem', mb: 1 }}
        >
          {growthText}
        </Typography>
      </CardContent>

      <Box sx={{ height: 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#1e293b" vertical={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.75rem',
              }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, stroke: '#f8fafc', strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default RevenueCard;
