import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/admin/feedback", {
          withCredentials: true,
        });
        setFeedbacks(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        sx={{
          color: i < rating ? "#facc15" : "#334155",
          fontSize: "1rem",
        }}
      />
    ));
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          color: "#ffffff",
          mb: 2,
          fontWeight: 600,
          textAlign: "left"
        }}
      >
        Admin Feedback
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#000309",
          borderRadius: 1,
          borderColor: "#192230",
          borderWidth: "0.2px",
          boxShadow: "0 0 0 1px #1e293b",
        }}
      >
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#94a3b8" }}>Username</TableCell>
              <TableCell sx={{ color: "#94a3b8" }} align="left">Feedback</TableCell>
              <TableCell sx={{ color: "#94a3b8" }} align="right">Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ color: "#e2e8f0" }}>
                  No feedback available.
                </TableCell>
              </TableRow>
            ) : (
              feedbacks.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    borderBottom: "1px solid #1e293b",
                    '&:hover': { backgroundColor: "#1e293b" },
                  }}
                >
                  <TableCell sx={{ color: "#e2e8f0" }}>{item.username}</TableCell>
                  <TableCell align="left" sx={{ color: "#e2e8f0" }}>{item.message}</TableCell>
                  <TableCell align="right" sx={{ color: "#e2e8f0" }}>
                    {renderStars(item.rating)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Feedback;
