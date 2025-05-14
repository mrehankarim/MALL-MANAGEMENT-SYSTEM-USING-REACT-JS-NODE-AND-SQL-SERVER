import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const AddShops = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Reset form when modal is closed
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
      setSelectedFile(null); // Clear file input after success
    } catch (err) {
      setMessage('Failed to upload shops.');
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
          p: 4,
          borderRadius: 2,
          minWidth: 350,
          maxWidth: 400,
        }}
      >
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={2}>
          Upload CSV File
        </Typography>

        <Typography variant="body2" mb={2}>
          <b>Required CSV format (with headers):</b>
          <br />
          shopNo,location,status,rent
          <br />
          <span style={{ color: '#888' }}>
            Example: <br />
            101,First Floor,pending,50000
          </span>
        </Typography>

        {/* Styled upload button */}
        <Button
          component="label"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
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
          disabled={uploading}
          fullWidth
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>

        {message && (
          <Typography
            mt={2}
            sx={{ color: message.includes('success') ? 'green' : 'red' }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default AddShops;
