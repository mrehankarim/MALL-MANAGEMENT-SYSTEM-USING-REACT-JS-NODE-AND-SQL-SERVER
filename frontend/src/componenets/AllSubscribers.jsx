import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Modal, Button, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import axios from 'axios';

const AllSubscribers = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchRevenueBySubscriber = async (username) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/admin/revenuebysubsciber?username=${username}`, {
        headers: { 'Accept': 'application/json' },
        withCredentials: true
      });
      const data = response.data.data;
      if (data.length !== 0) {
        setTotalRevenue(data[0].totalSales);
        setSelectedUsername(username);
        setOpenModal(true); // Open the modal when revenue data is fetched
      }
    } catch (error) {
      console.log("Error fetching revenue");
    }
  }

  const downloadSubscribers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/admin/download", {
        withCredentials: true,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      const contentDisposition = response.headers['content-disposition'];
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'subscribers.csv';

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download subscribers");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/admin/subscribers', {
          headers: { 'Accept': 'application/json' },
          withCredentials: true
        });
        setSubscriptions(response.data.data);
        setFilteredSubscriptions(response.data.data);
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim() === "") {
        setFilteredSubscriptions(subscriptions);
      } else {
        const filtered = subscriptions.filter((sub) =>
          sub.mallowner_username.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredSubscriptions(filtered);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, subscriptions]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setTotalRevenue(0); // Reset revenue when closing the modal
    setSelectedUsername(null); // Clear the username when closing the modal
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button onClick={downloadSubscribers}>Download</Button>
        <TextField
          label="Search"
          variant="outlined"
          sx={{
            width: '400px',
            '& .MuiInputLabel-root': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#192230' },
              '&:hover fieldset': { borderColor: '#192230' },
              '&.Mui-focused fieldset': { borderColor: '#192230' },
            },
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search by username'
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 1,
          borderColor: "#192230",
          borderWidth: "0.2px",
          p: 2,
          backgroundColor: "#000309",
          boxShadow: "0 0 0 1px #1e293b",
        }}
      >
        <Table sx={{ minWidth: 650 }} size="small" aria-label="subscriptions table">
          <TableHead>
            <TableRow sx={{ borderBottom: "1px solid #1e293b" }}>
              <TableCell sx={{ color: "#94a3b8" }}>ID</TableCell>
              <TableCell align="right" sx={{ color: "#94a3b8" }}>Username</TableCell>
              <TableCell align="right" sx={{ color: "#94a3b8" }}>Start Date</TableCell>
              <TableCell align="right" sx={{ color: "#94a3b8" }}>End Date</TableCell>
              <TableCell align="right" sx={{ color: "#94a3b8" }}>Subscription Fee</TableCell>
              <TableCell align="right" sx={{ color: "#94a3b8" }}>Status</TableCell>
              <TableCell align="right" sx={{ color: "#94a3b8" }}>Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubscriptions.map((subscription, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  borderBottom: "1px solid #1e293b",
                  '&:hover': { backgroundColor: "#1e293b" },
                }}
              >
                <TableCell sx={{ color: "#e2e8f0" }}>{subscription.subscription_id}</TableCell>
                <TableCell align="right" sx={{ color: "#e2e8f0" }}>{subscription.mallowner_username}</TableCell>
                <TableCell align="right" sx={{ color: "#e2e8f0" }}>{subscription.start_date.split("T")[0]}</TableCell>
                <TableCell align="right" sx={{ color: "#e2e8f0" }}>{subscription.end_date.split("T")[0]}</TableCell>
                <TableCell align="right" sx={{ color: "#e2e8f0" }}>${subscription.amount}</TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1,
                      py: 0.5,
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor: "#3B82F6",
                      color: "#0f172a",
                    }}
                  >
                    {subscription.status}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box
                    component="button"
                    sx={{
                      backgroundColor: "#14b8a6",
                      color: "#0f172a",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      px: 2,
                      py: 0.5,
                      borderRadius: "999px",
                      border: "none",
                      cursor: "pointer",
                      '&:hover': { backgroundColor: "#0d9488" },
                    }}
                    onClick={() => fetchRevenueBySubscriber(subscription.mallowner_username)}
                  >
                    Revenue
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: "white",
            padding: 4,
            borderRadius: '8px',
            borderColor: "#3a3845",
            boxShadow: 24,
            width: '400px',
            color: "black"
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Revenue for {selectedUsername}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Total Revenue: ${totalRevenue}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AllSubscribers;
