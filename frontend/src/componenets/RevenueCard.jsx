import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip
} from '@mui/material';
import { TrendingUp as TrendingIcon } from '@mui/icons-material';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis
} from 'recharts';

const RevenueCard = ({ title, value, growthText, chartData }) => {
  return (
    <Card
      sx={{
        borderRadius: '12px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        width: '100%',
        maxWidth: 320,
        p: 2,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderLeft: '4px solid #8b5cf6',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <CardContent sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TrendingIcon color="secondary" fontSize="small" />
          <Typography
            variant="subtitle2"
            sx={{ 
              color: '#94a3b8', 
              fontSize: '0.85rem', 
              fontWeight: 600 
            }}
          >
            {title}
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          ${value}
        </Typography>

        <Chip
          label={growthText}
          size="small"
          icon={<TrendingIcon fontSize="small" />}
          sx={{
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            color: '#8b5cf6',
            mb: 2,
            fontWeight: 500
          }}
        />

        <Box sx={{ height: 100, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.75rem',
                }}
                labelStyle={{ 
                  color: '#f1f5f9',
                  fontWeight: 600
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ 
                  r: 3, 
                  stroke: '#8b5cf6', 
                  strokeWidth: 2,
                  fill: '#0f172a'
                }}
                activeDot={{ 
                  r: 5, 
                  stroke: '#f8fafc', 
                  strokeWidth: 2 
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueCard;