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
    Paper
} from '@mui/material';
import axios from 'axios';

// Role mapping for display
const ROLE_MAP = {
    1: 'Manager',
    2: 'Cashier',
    3: 'Security',
    4: 'Cleaner',
    5: 'Technician'
};

const Employee = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/subscriber/getemployees', {
                    withCredentials: true
                });
                console.log('heere', response.data)
                setEmployees(response.data.data);
            } catch (error) {
                console.error("Failed to fetch employees:", error);
            }
        };
        fetchEmployees();
    }, []);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 2 }}>
                Employees Overview
            </Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: "#020317", color: '#f1f5f9' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#3B82F6' }}>SSN</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Name</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Email</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Phone Number</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Role</TableCell>
                            <TableCell sx={{ color: '#3B82F6' }}>Salary (PKR)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((emp) => (
                            <TableRow key={emp.ssn}>
                                <TableCell sx={{ color: '#f1f5f9' }}>{emp.ssn}</TableCell>
                                <TableCell sx={{ color: '#f1f5f9' }}>{emp.name}</TableCell>
                                <TableCell sx={{ color: '#f1f5f9' }}>{emp.email}</TableCell>
                                <TableCell sx={{ color: '#f1f5f9' }}>{emp.phone_number}</TableCell>
                                <TableCell sx={{ color: '#f1f5f9' }}>{ROLE_MAP[emp.role_id] || emp.role_id}</TableCell>
                                <TableCell sx={{ color: '#f1f5f9' }}>{emp.salary.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Employee;