import React from 'react';
import { Box, Container, Typography, Stack, Link, Divider } from '@mui/material';
import { useTheme } from '@emotion/react';
const Footer = () => {
    const theme=useTheme()
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor:theme.palette.background.default,
                color: '#ffffff',
                py: 4,
                borderTop: '2px solid #192230',
                mt: 8,
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'center', sm: 'flex-start' }}
                    spacing={3}
                >
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Mall Matrix
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#bbbbbb', mt: 1 }}>
                            Built for the future of mall management.
                        </Typography>
                    </Box>

                    <Stack spacing={1}>
                        <Link href="/" underline="none" color="#bbbbbb" sx={{ '&:hover': { color: '#ffffff' } }}>
                            Home
                        </Link>
                        <Link href="/about" underline="none" color="#bbbbbb" sx={{ '&:hover': { color: '#ffffff' } }}>
                            About
                        </Link>
                        <Link href="/pricing" underline="none" color="#bbbbbb" sx={{ '&:hover': { color: '#ffffff' } }}>
                            Pricing
                        </Link>
                        <Link href="/contact" underline="none" color="#bbbbbb" sx={{ '&:hover': { color: '#ffffff' } }}>
                            Contact
                        </Link>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 3, borderColor: '#333' }} />

                <Typography variant="body2" align="center" color="#777">
                    &copy; {new Date().getFullYear()} Mall Matrix. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
