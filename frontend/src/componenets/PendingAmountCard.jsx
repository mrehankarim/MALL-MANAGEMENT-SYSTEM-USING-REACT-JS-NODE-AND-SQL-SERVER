import React, { useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import RentPaymentForm from './RentPaymentForm';
import BillPaymentForm from './BillPaymentForm'; 

const PendingAmountCard = ({ title, value, shopNo }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Card
        sx={{
          borderRadius: '20px',
          backgroundColor: '#020317', // Very dark blue
          color: '#f1f5f9',
          width: '80%',
          maxWidth: 210,
          height: 200,
          marginLeft: 5,
          p: 2,
          boxShadow: '0 0 0 1px #1e293b',
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle2"
            sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 0.5 }}
          >
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'normal', fontSize: '1.8rem', mb: 0.5 }}>
            {value > 0 ? `$${value}` : 'Nothing is pending'}
          </Typography>
          {value > 0 && (
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: '#3b82f6',
                color: '#f1f5f9',
                '&:hover': { backgroundColor: '#2563eb' },
              }}
              onClick={() => setOpenModal(true)} // Open the modal
            >
              Pay Now
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Conditionally Render Payment Form Modal */}
      {openModal && (
        <>
          {title === 'Pending Utility Bills' ? (
            <BillPaymentForm
              open={openModal}
              onClose={() => setOpenModal(false)} // Close the modal
              title={title}
              shopNo={shopNo} // Pass shop number if needed
            />
          ) : (
            <RentPaymentForm
              open={openModal}
              onClose={() => setOpenModal(false)} // Close the modal
              title={title}
              shopNo={shopNo} // Pass shop number if needed
            />
          )}
        </>
      )}
    </>
  );
};

export default PendingAmountCard;