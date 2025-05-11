import React, { useState } from 'react'
import { Box, Container, Typography, TextField, Button, IconButton, useTheme, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const Signup = ({ setSignUp }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role:'admin'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/register', formData, {
                headers: {
                    'Accept': 'application/json',
                }
            });

            console.log(response);
            setFormData({
                username: '',
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                role:'admin'
            });
            alert("Registration Successful");
            setSignUp(prev => !prev);
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                onClick={() => setSignUp(prev => !prev)}
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 9998,
                }}
            />

            <Container
                onClick={(e) => e.stopPropagation()}
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        position: "relative",
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        border: '2px solid #192230',
                        borderRadius: '10px',
                        p: 4,
                        backgroundColor: theme.palette.background.default,
                        width: { md: "50%", xs: '90%' },
                    }}
                >
                    <IconButton
                        onClick={() => setSignUp(prev => !prev)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
                        Sign Up
                    </Typography>

                    {error && (
                        <Typography color="error" variant="body2" textAlign="center" mb={2}>
                            {error}
                        </Typography>
                    )}

                    <TextField
                        name="username"
                        label="Username"
                        value={formData.username}
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
                        name="firstName"
                        label="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        name="lastName"
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <Button variant="outlined" type="submit" disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default Signup;
