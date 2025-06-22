import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';

const Pricing = () => {
    return (
        <Container
            id="pricing"
            sx={{
                py: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid",
                borderColor: 'divider',
                borderRadius: "12px",
                my: 4,
                backgroundColor: 'background.paper'
            }}
            >
            <Box
                sx={{
                display: "flex",
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                maxWidth: "1000px",
                gap: 4,
                p: 4,
                }}
            >
                <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    Scale smarter with MallMatrix
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
                    Simplify your mall operations with our all-in-one management platform.
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    No hidden fees. No long-term contracts.
                </Typography>
                </Box>
                <Box
                sx={{
                    flex: 1,
                    maxWidth: "400px",
                    border: "1px solid",
                    borderColor: 'divider',
                    borderRadius: "12px",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: 'background.default'
                }}
                >
                <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center" }}>
                    Pro Plan
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
                    Perfect for small to mid-sized malls
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: "primary.main", my: 1 }}>
                    $150,000 / mo
                </Typography>
                <Box sx={{ 
                    textAlign: "center", 
                    color: "text.secondary",
                    mb: 2
                }}>
                    {['Unlimited Tenants', 'Real-time Analytics', 'Auto Invoicing', 'Support Included'].map(item => (
                    <Typography key={item} sx={{ py: 0.5 }}>• {item}</Typography>
                    ))}
                </Box>
                <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ borderRadius: '8px' }}
                >
                    Get Started
                </Button>
                </Box>
            </Box>
            </Container>
    );
};

export default Pricing;
