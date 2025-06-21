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
            // Format date to remove time
            const formattedData = response.data.data?.map(item => ({
                ...item,
                date: item.date.split('T')[0] // Keep only the date part
            })) || [];
            setAttendance(formattedData);
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
        <Box sx={{ mt: 4, p: 2, backgroundColor: '#0f172a', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 2, fontWeight: 600 }}>
                Employee Attendance
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateAttendance}
                    disabled={loading}
                    sx={{
                        textTransform: 'none',
                        px: 3,
                        fontWeight: 500
                    }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Generate Attendance'}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setShowDateDialog(true)}
                    disabled={loading}
                    sx={{
                        textTransform: 'none',
                        px: 3,
                        fontWeight: 500,
                        borderColor: '#3B82F6',
                        color: '#3B82F6',
                        '&:hover': {
                            borderColor: '#60A5FA'
                        }
                    }}
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
                <DialogTitle sx={{ backgroundColor: '#0f172a', color: '#f1f5f9' }}>
                    Select Date
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#0f172a', pt: 2 }}>
                    <TextField
                        type="date"
                        value={dateInput}
                        onChange={e => setDateInput(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            sx: {
                                color: '#f1f5f9',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#3B82F6'
                                }
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#0f172a' }}>
                    <Button 
                        onClick={() => setShowDateDialog(false)}
                        sx={{ color: '#f1f5f9' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGetAttendance}
                        disabled={!dateInput || loading}
                        variant="contained"
                        sx={{
                            backgroundColor: '#3B82F6',
                            '&:hover': { backgroundColor: '#2563EB' },
                            textTransform: 'none'
                        }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Get'}
                    </Button>
                </DialogActions>
            </Dialog>

            {showTable && (
                <>
                    <TableContainer component={Paper} sx={{
                        backgroundColor: "#1e293b",
                        color: '#f1f5f9',
                        borderRadius: '8px',
                        border: '1px solid #334155',
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
                                    <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#334155' } }}>
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
                                                    variant={row.status === 'present' ? 'contained' : 'outlined'}
                                                    size="small"
                                                    onClick={() => handleMarkAttendance(row.ssn, 'present')}
                                                    disabled={loading}
                                                    sx={{
                                                        backgroundColor: row.status === 'present' ? '#10b981' : 'transparent',
                                                        color: row.status === 'present' ? 'white' : '#10b981',
                                                        borderColor: '#10b981',
                                                        '&:hover': { 
                                                            backgroundColor: row.status === 'present' ? '#059669' : 'rgba(16, 185, 129, 0.1)' 
                                                        },
                                                        textTransform: 'none',
                                                        minWidth: 80
                                                    }}
                                                >
                                                    Present
                                                </Button>
                                                <Button
                                                    variant={row.status === 'absent' ? 'contained' : 'outlined'}
                                                    size="small"
                                                    onClick={() => handleMarkAttendance(row.ssn, 'absent')}
                                                    disabled={loading}
                                                    sx={{
                                                        backgroundColor: row.status === 'absent' ? '#ef4444' : 'transparent',
                                                        color: row.status === 'absent' ? 'white' : '#ef4444',
                                                        borderColor: '#ef4444',
                                                        '&:hover': { 
                                                            backgroundColor: row.status === 'absent' ? '#dc2626' : 'rgba(239, 68, 68, 0.1)' 
                                                        },
                                                        textTransform: 'none',
                                                        minWidth: 80
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
                                px: 3,
                                fontWeight: 500
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