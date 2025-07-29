import React from 'react';
import { Box, Container, Typography, Stack, Link, Divider } from '@mui/material';
import { useTheme } from '@emotion/react';
const Footer = () => {
    const theme=useTheme()
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                py: 6,
                borderTop: '1px solid',
                borderColor: theme.palette.divider,
                mt: 8,
            }}
            >
            <Container maxWidth="lg">
                <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'center', sm: 'flex-start' }}
                spacing={4}
                sx={{ mb: 4 }}
                >
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    MallMatrix
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Built for the future of mall management.
                    </Typography>
                </Box>

                <Stack spacing={1}>
                    {['Home', 'About', 'Pricing', 'Contact'].map((item) => (
                    <Link 
                        href={`#${item.toLowerCase()}`} 
                        key={item}
                        underline="none" 
                        color="text.secondary"
                        sx={{ 
                        '&:hover': { 
                            color: 'primary.main',
                            textDecoration: 'underline'
                        },
                        transition: 'color 0.2s'
                        }}
                    >
                        {item}
                    </Link>
                    ))}
                </Stack>
                </Stack>

                <Divider sx={{ my: 3, borderColor: 'divider' }} />

                <Typography variant="body2" align="center" color="text.secondary">
                &copy; {new Date().getFullYear()} Mall Matrix. All rights reserved.
                </Typography>
            </Container>
            </Box>
    );
};

export default Footer;
