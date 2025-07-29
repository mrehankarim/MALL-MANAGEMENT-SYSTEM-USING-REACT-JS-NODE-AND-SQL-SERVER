import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Modal, 
  Typography, 
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Upload as UploadIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';

const AddShops = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setMessage('');
    }
  }, [open]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a CSV file.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);

      await axios.post('http://localhost:3000/api/v1/subscriber/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      setMessage('Shops uploaded successfully!');
      setSelectedFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to upload shops.');
    } finally {
      setUploading(false);
    }
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
          p: 3,
          borderRadius: 2,
          width: { xs: '90%', sm: '500px' },
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Upload Shops Data
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Required CSV format (with headers):
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, color: 'black' }}>shopNo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'black' }}>location</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'black' }}>status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'black' }}>rent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>101</TableCell>
                <TableCell>First Floor</TableCell>
                <TableCell>
                  <Chip label="vacant" size="small" color="warning" />
                </TableCell>
                <TableCell>50000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          component="label"
          variant="outlined"
          fullWidth
          startIcon={<UploadIcon />}
          sx={{ mb: 2, py: 1 }}
        >
          {selectedFile ? selectedFile.name : 'Choose CSV File'}
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            hidden
          />
        </Button>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          fullWidth
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ py: 1 }}
        >
          {uploading ? 'Uploading...' : 'Upload Shops'}
        </Button>

        {message && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: message.includes('success') ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)'
            }}
          >
            {message.includes('success') ? (
              <SuccessIcon color="success" fontSize="small" />
            ) : (
              <ErrorIcon color="error" fontSize="small" />
            )}
            <Typography variant="body2" color={message.includes('success') ? 'success.main' : 'error.main'}>
              {message}
            </Typography>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AddShops;