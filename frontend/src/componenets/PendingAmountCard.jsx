import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Box,
  Chip
} from '@mui/material';
import { 
  Payments as PaymentsIcon,
  Receipt as BillIcon
} from '@mui/icons-material';
import RentPaymentForm from './RentPaymentForm';
import BillPaymentForm from './BillPaymentForm';

const PendingAmountCard = ({ title, value, shopNo }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Card
        sx={{
          borderRadius: '12px',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          width: '100%',
          maxWidth: 240,
          height: 200,
          p: 2,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderLeft: `4px solid ${title === 'Pending Rent' ? '#3b82f6' : '#10b981'}`,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {title === 'Pending Rent' ? (
              <PaymentsIcon color="primary" fontSize="small" />
            ) : (
              <BillIcon color="success" fontSize="small" />
            )}
            <Typography
              variant="subtitle2"
              sx={{ 
                color: '#94a3b8', 
                fontSize: '1 rem', 
                fontWeight: 600 
              }}
            >
              {title}
            </Typography>
          </Box>

          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 50, 
              my: 'auto',
              color: value > 0 ? '#f8fafc' : '#FFFFFF'
            }}
          >
            {value > 0 ? `$${value}` : 'No pending amount'}
          </Typography>

          {value > 0 && (
            <Button
              variant="contained"
              startIcon={title === 'Pending Rent' ? <PaymentsIcon /> : <BillIcon />}
              sx={{
                mt: 'auto',
                backgroundColor: title === 'Pending Rent' ? '#3b82f6' : '#10b981',
                color: '#f8fafc',
                '&:hover': { 
                  backgroundColor: title === 'Pending Rent' ? '#2563eb' : '#059669' 
                },
                textTransform: 'none',
                fontWeight: 500
              }}
              onClick={() => setOpenModal(true)}
            >
              Pay Now
            </Button>
          )}
        </CardContent>
      </Card>

      {openModal && (
        <>
          {title === 'Pending Utility Bills' ? (
            <BillPaymentForm
              open={openModal}
              onClose={() => setOpenModal(false)}
              title={title}
              shopNo={shopNo}
            />
          ) : (
            <RentPaymentForm
              open={openModal}
              onClose={() => setOpenModal(false)}
              title={title}
              shopNo={shopNo}
            />
          )}
        </>
      )}
    </>
  );
};

export default PendingAmountCard;