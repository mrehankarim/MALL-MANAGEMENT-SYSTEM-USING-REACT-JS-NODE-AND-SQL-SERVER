import React, { useState } from 'react';
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
    Button,
    TextField,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import axios from 'axios';

const EmployeeAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [showDateDialog, setShowDateDialog] = useState(false);
    const [dateInput, setDateInput] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleGenerateAttendance = async () => {
        setLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            await axios.post(
                'http://localhost:3000/api/v1/subscriber/generate/attendance',
                {},
                { withCredentials: true }
            );
            setSuccessMsg('Attendance generated for today!');
        } catch (err) {
            setError('Failed to generate attendance.');
        } finally {
            setLoading(false);
        }
    };

    const handleGetAttendance = async () => {
        setLoading(true);
        setError('');
        setSuccessMsg('');
        setShowTable(false);
        try {
            const response = await axios.get(
                'http://localhost:3000/api/v1/subscriber/employeesattendance',
                {
                    params: { date: dateInput },
                    withCredentials: true
                }
            );
            setAttendance(response.data.data || []);
            setShowTable(true);
        } catch (err) {
            setError('Failed to fetch attendance.');
        } finally {
            setLoading(false);
            setShowDateDialog(false);
        }
    };

    const handleMarkAttendance = async (ssn, status) => {
        setLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            await axios.post(
                'http://localhost:3000/api/v1/subscriber/update/attendance',
                {
                    ssn,
                    status,
                    date: dateInput
                },
                { withCredentials: true }
            );
            
            setAttendance(prev => prev.map(item => 
                item.ssn === ssn ? { ...item, status } : item
            ));
            setSuccessMsg(`Attendance marked as ${status} successfully!`);
        } catch (err) {
            setError('Failed to mark attendance.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAttendance = async () => {
        setLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            await axios.post(
                'http://localhost:3000/api/v1/subscriber/save/attendance',
                {},
                { withCredentials: true }
            );
            setSuccessMsg('Attendance saved successfully!');
        } catch (err) {
            setError('Failed to save attendance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 2 }}>
                Employee Attendance
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateAttendance}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Generate Attendance'}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setShowDateDialog(true)}
                    disabled={loading}
                >
                    Get Attendance
                </Button>
            </Box>
            {error && (
                <Typography color="error" mb={2}>{error}</Typography>
            )}
            {successMsg && (
                <Typography color="success.main" mb={2}>{successMsg}</Typography>
            )}

            <Dialog open={showDateDialog} onClose={() => setShowDateDialog(false)}>
                <DialogTitle>Enter Date</DialogTitle>
                <DialogContent>
                    <TextField
                        type="date"
                        value={dateInput}
                        onChange={e => setDateInput(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDateDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleGetAttendance}
                        disabled={!dateInput || loading}
                        variant="contained"
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Get'}
                    </Button>
                </DialogActions>
            </Dialog>

            {showTable && (
                <>
                    <TableContainer component={Paper} sx={{
                        backgroundColor: "#020317",
                        color: '#f1f5f9',
                        borderRadius: '8px',
                        border: '1px solid #1e293b',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        mt: 3
                    }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: '#3B82F6', fontWeight: 600 }}>SSN</TableCell>
                                    <TableCell sx={{ color: '#3B82F6', fontWeight: 600 }}>Name</TableCell>
                                    <TableCell sx={{ color: '#3B82F6', fontWeight: 600 }}>Date</TableCell>
                                    <TableCell sx={{ color: '#3B82F6', fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ color: '#3B82F6', fontWeight: 600 }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendance.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell sx={{ color: '#e2e8f0' }}>{row.ssn}</TableCell>
                                        <TableCell sx={{ color: '#e2e8f0' }}>{row.name}</TableCell>
                                        <TableCell sx={{ color: '#e2e8f0' }}>{row.date}</TableCell>
                                        <TableCell
                                            sx={{
                                                color: row.status === 'absent' ? '#ef4444' : '#10b981',
                                                fontWeight: 600,
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {row.status}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleMarkAttendance(row.ssn, 'present')}
                                                    disabled={loading}
                                                    sx={{
                                                        backgroundColor: '#10b981',
                                                        '&:hover': { backgroundColor: '#059669' },
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    Present
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleMarkAttendance(row.ssn, 'absent')}
                                                    disabled={loading}
                                                    sx={{
                                                        backgroundColor: '#ef4444',
                                                        '&:hover': { backgroundColor: '#dc2626' },
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    Absent
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleSaveAttendance}
                            disabled={loading}
                            sx={{
                                backgroundColor: '#3B82F6',
                                '&:hover': { backgroundColor: '#2563EB' },
                                textTransform: 'none',
                                px: 3
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Attendance'}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default EmployeeAttendance;