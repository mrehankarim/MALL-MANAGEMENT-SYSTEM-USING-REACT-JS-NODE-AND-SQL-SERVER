import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button
} from '@mui/material';
import axios from 'axios';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/subscriber/stores', {
          withCredentials: true
        });
        console.log(res.data);
        setStores(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Function to activate store
  const activateStore = async (storeId) => {
    try {
      await axios.post(
        'http://localhost:3000/api/v1/subscriber/activate', 
        { store_id: storeId },
        { withCredentials: true }
      );
      
      // Update store status locally after activation
      setStores((prevStores) =>
        prevStores.map((store) =>
          store.store_id === storeId ? { ...store, status: 'active' } : store
        )
      );
    } catch (error) {
      console.error("Failed to activate store:", error);
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 4, backgroundColor: "#020317" }}>
      <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 2 }}>
        Stores Overview
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={150}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: "#020317" }}>
          <Table size="small" aria-label="stores table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#3B82F6' }}>Store Name</TableCell>
                <TableCell sx={{ color: '#3B82F6' }}>Shop No</TableCell>
                <TableCell sx={{ color: '#3B82F6' }}>Category</TableCell>
                <TableCell sx={{ color: '#3B82F6' }}>Status</TableCell>
                <TableCell sx={{ color: '#3B82F6' }}>Owner Username</TableCell>
                <TableCell sx={{ color: '#3B82F6' }}>Shop Owner</TableCell>
                <TableCell sx={{ color: '#3B82F6' }}>Rent (PKR)</TableCell>
                <TableCell sx={{ color: '#3B82F6' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.store_id}>
                  <TableCell sx={{ color: '#f1f5f9' }}>{store.store_name}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}>{store.shop_no}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9', textTransform: 'capitalize' }}>
                    {store.category}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: store.status === 'active' ? '#34d399' : '#f87171',
                    }}
                  >
                    {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                  </TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}>{store.store_owner_username}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}>{store.shopowner}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}>
                    {store.rent_amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {store.status === 'inactive' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => activateStore(store.store_id)}
                        sx={{
                          backgroundColor: '#3B82F6',
                          '&:hover': { backgroundColor: '#2563EB' },
                          color: '#f1f5f9',
                          borderRadius: '8px',
                          paddingX: 3,
                        }}
                      >
                        Activate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {stores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ color: '#f87171' }}>
                    No stores found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default Stores;
