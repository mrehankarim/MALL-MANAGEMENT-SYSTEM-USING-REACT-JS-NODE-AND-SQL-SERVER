import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, IconButton, useTheme, CircularProgress, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const AddEmployee = ({ setAddEmployee }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    ssn: '',
    name: '',
    email: '',
    phone: '',
    role_id: 1,
    salary: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'role_id' || name === 'salary' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('heree', formData);
      await axios.post('http://localhost:3000/api/v1/subscriber/add/employee', formData, {
        headers: { 'Accept': 'application/json' },
        withCredentials: true,
      });

      setFormData({
        ssn: '',
        name: '',
        email: '',
        phone: '',
        role_id: 1,
        salary: '',
      });
      setAddEmployee(prev => !prev);
      alert("Employee added successfully");
    } catch (error) {
      setError('Failed to add employee. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 9998,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={() => setAddEmployee(prev => !prev)}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: '2px solid #192230',
          borderRadius: '10px',
          p: 4,
          backgroundColor: theme.palette.background.default,
          width: { md: "50%", xs: '90%' },
          maxWidth: 500,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <IconButton
          onClick={() => setAddEmployee(prev => !prev)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
          Add Employee
        </Typography>
        {error && (
          <Typography color="error" variant="body2" textAlign="center" mb={2}>
            {error}
          </Typography>
        )}

        <TextField
          name="ssn"
          label="SSN"
          type="text"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={formData.ssn}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          name="phone"
          label="Phone Number"
          type="text"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          required
        />
        
        <TextField
          select
          name="role_id"
          label="Role"
          value={formData.role_id}
          onChange={handleChange}
          fullWidth
          required
          SelectProps={{
            MenuProps: {
              sx: {
                zIndex: 99999, // Higher than modal backdrop
              },
              PaperProps: {
                sx: {
                  maxHeight: 200,
                },
              },
            },
          }}
        >
          <MenuItem value={1}>Manager</MenuItem>
          <MenuItem value={2}>Cashier</MenuItem>
          <MenuItem value={3}>Security</MenuItem>
          <MenuItem value={4}>Cleaner</MenuItem>
          <MenuItem value={5}>Technician</MenuItem>
        </TextField>

        <TextField
          name="salary"
          label="Salary"
          type="number"
          value={formData.salary}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{
            min: 0,
            step: 1000,
          }}
        />

        <Button 
          variant="contained" 
          type="submit" 
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Employee"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddEmployee;