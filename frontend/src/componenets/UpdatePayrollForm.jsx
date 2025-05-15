import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import axios from 'axios';

    const UpdatePayrollForm = ({ open, onClose, employee, onUpdate }) => {
        const [paymentMethod, setPaymentMethod] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');

        if (!employee) return null;

        const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post(
                'http://localhost:3000/api/v1/subscriber/updatepayroll',
                {
                    ssn: employee.ssn,
                    amount: employee.salary_paid,
                    method: paymentMethod,
                    type: 'miscellaneous',
                    date: employee.month_year,
                },
                { withCredentials: true }
            );

            onUpdate(); // Refresh data
            onClose();  // Close dialog
        } catch (err) {
            setError('Failed to update payroll. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Pay Salary</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Typography color="error" mb={2}>{error}</Typography>
                    )}
                    <Box mb={2}>
                        <Typography variant="body1"><strong>Employee:</strong> {employee.employee_name}</Typography>
                        <Typography variant="body1"><strong>Amount:</strong> PKR {employee.salary_paid?.toLocaleString('en-PK')}</Typography>
                        <Typography variant="body1"><strong>Month/Year:</strong> {new Date(employee.month_year).toLocaleString('default', { month: 'long', year: 'numeric' })}</Typography>
                    </Box>
                    <FormControl fullWidth required margin="normal">
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                            value={paymentMethod}
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                console.log(e.target.value); // Log the selected payment method
                            }}
                            label="Payment Method"
                        >
                            <MenuItem value="cash">Cash</MenuItem>
                            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                            <MenuItem value="credit_card">Credit Card</MenuItem>
                            <MenuItem value="UPI">UPI</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading || !paymentMethod}
                    >
                        {loading ? 'Processing...' : 'Pay'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UpdatePayrollForm;
