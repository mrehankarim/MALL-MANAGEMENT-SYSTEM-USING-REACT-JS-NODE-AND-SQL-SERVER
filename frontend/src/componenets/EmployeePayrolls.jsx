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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import axios from 'axios';
import UpdatePayrollForm from './UpdatePayrollForm';

// Add this new component
const UpdatePayrollsForm = ({ open, onClose, employeeId, onUpdate }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Call your API to update payroll
            await axios.post(
                'http://localhost:3000/api/v1/subscriber/updatepayroll',
                {
                    employee_id: employeeId,
                    amount: parseFloat(amount)
                },
                { withCredentials: true }
            );
            
            onUpdate(); // Refresh the payroll data
            onClose(); // Close the dialog
        } catch (err) {
            setError('Failed to update payroll. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Payroll</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Typography color="error" mb={2}>{error}</Typography>
                    )}
                    <TextField
                        label="Amount (PKR)"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                        inputProps={{
                            step: "0.01",
                            min: "0"
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Update'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const EmployeePayrolls = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchPayrolls = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/api/v1/subscriber/employeespayroll',
                    {
                        withCredentials: true
                    }
                );
                setPayrolls(response.data.data);
            } catch (error) {
                console.error("Failed to fetch employee payrolls:", error);
            }
        };
        fetchPayrolls();
    }, []);

    const formatMonthYear = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const handlePayNow = (employee) => {
        setSelectedEmployee({
            employee_name: employee.employee_name,
            salary_paid: employee.salary_paid,
            month_year: employee.month_year,
            ssn: employee.ssn,
        });
        setShowUpdateForm(true);
    };

    const handleUpdateComplete = () => {
        // Refresh the payroll data after update
        const fetchPayrolls = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/api/v1/subscriber/employeespayroll',
                    {
                        withCredentials: true
                    }
                );
                setPayrolls(response.data.data);
            } catch (error) {
                console.error("Failed to fetch employee payrolls:", error);
            }
        };
        fetchPayrolls();
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 2 }}>
                Employee Payrolls
            </Typography>
            <TableContainer component={Paper} sx={{ 
                backgroundColor: "#020317", 
                color: '#f1f5f9',
                borderRadius: '8px',
                border: '1px solid #1e293b',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ borderBottom: '1px solid #1e293b' }}>
                            <TableCell sx={{ color: '#3B82F6', fontWeight: 600 }}>Employee Name</TableCell>
                            <TableCell sx={{ color: '#3B82F6', fontWeight: 600 }}>Salary (PKR)</TableCell>
                            <TableCell sx={{ color: '#3B82F6', fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ color: '#3B82F6', fontWeight: 600 }}>Month/Year</TableCell>
                            <TableCell sx={{ color: '#3B82F6', fontWeight: 600 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payrolls.map((row, idx) => (
                            <TableRow 
                                key={idx}
                                sx={{
                                    '&:hover': { backgroundColor: '#1e293b' },
                                    borderBottom: '1px solid #1e293b',
                                }}
                            >
                                <TableCell sx={{ color: '#e2e8f0' }}>{row.employee_name}</TableCell>
                                <TableCell sx={{ color: '#e2e8f0' }}>
                                    {row.salary_paid?.toLocaleString('en-PK')}
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            px: 2,
                                            py: 1,
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            backgroundColor: row.status === 'pending' ? 
                                                'rgba(239, 68, 68, 0.2)' : 'rgba(52, 211, 153, 0.2)',
                                            color: row.status === 'pending' ? '#ef4444' : '#10b981',
                                            border: row.status === 'pending' ? 
                                                '1px solid #ef4444' : '1px solid #10b981',
                                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                        }}
                                    >
                                        {row.status}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ color: '#e2e8f0' }}>
                                    {formatMonthYear(row.month_year)}
                                </TableCell>
                                <TableCell>
                                    {row.status === 'pending' ? (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handlePayNow(row)}
                                            sx={{
                                                backgroundColor: '#3B82F6',
                                                color: 'white',
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                px: 2,
                                                py: 1,
                                                borderRadius: '6px',
                                                '&:hover': {
                                                    backgroundColor: '#2563EB',
                                                    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
                                                }
                                            }}
                                        >
                                            Pay Now
                                        </Button>
                                    ) : (
                                        <Box sx={{ 
                                            color: '#94a3b8',
                                            fontStyle: 'italic',
                                            fontSize: '0.875rem'
                                        }}>
                                            Paid
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Show UpdatePayrollForm as a dialog when Pay Now is clicked */}
            <UpdatePayrollForm
                open={showUpdateForm}
                onClose={() => setShowUpdateForm(false)}
                employee={selectedEmployee}
                onUpdate={handleUpdateComplete}
            />

        </Box>
    );
};

export default EmployeePayrolls;