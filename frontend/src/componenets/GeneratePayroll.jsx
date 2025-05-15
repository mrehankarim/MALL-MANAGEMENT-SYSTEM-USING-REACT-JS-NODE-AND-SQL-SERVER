import React, { useState } from 'react';
import { Box, Button, Typography, Modal, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const GeneratePayroll = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  // Get current month and year
  const now = new Date();
  const monthYear = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleGenerate = async () => {
    setLoading(true);
    setSuccessMsg('');
    setError('');
    // Fake loading for 2-3 seconds
    setTimeout(async () => {
      try {
        await axios.post(
          'http://localhost:3000/api/v1/subscriber/generatepayrolls',
          { date: now.toISOString().slice(0, 10) }, // YYYY-MM-DD
          { withCredentials: true }
        );
        setSuccessMsg('Payroll generated successfully!');
      } catch (err) {
        setError('Failed to generate payroll.');
      } finally {
        setLoading(false);
      }
    }, Math.floor(Math.random() * 1000) + 2000); // 2-3 seconds
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          minWidth: 320,
          maxWidth: 400,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" mb={2} textAlign="center">
          Generate Payroll
        </Typography>
        <Typography variant="body1" mb={3} textAlign="center">
          Current Month: <b>{monthYear}</b>
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <CircularProgress />
            <Typography mt={2}>Generating payroll...</Typography>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleGenerate}
            sx={{ mb: 2 }}
          >
            Generate
          </Button>
        )}
        {successMsg && (
          <Typography color="success.main" textAlign="center">{successMsg}</Typography>
        )}
        {error && (
          <Typography color="error" textAlign="center">{error}</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default GeneratePayroll;