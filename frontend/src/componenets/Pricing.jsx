import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';

const Pricing = () => {
    return (
        <Container
        id="pricing"
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border:"2px solid #192230",
                borderRadius:"10px",
                marginTop:"30px"
            }}
        >
            <Box
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "1000px",
                    gap: "30px",
                    padding: "20px",
                }}
            >
                <Box style={{ flex: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                        Scale smarter with MallMatrix
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#afaaaa", mb: 3 }}>
                        Simplify your mall operations and gain valuable insights with our all-in-one management platform. From tenant tracking to real-time analytics — everything is just one click away.
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#afaaaa" }}>
                        No hidden fees. No long-term contracts. Just powerful tools to grow your mall business.
                    </Typography>
                </Box>
                <Box
                    style={{
                        flex: 1,
                        maxWidth: "400px",
                        border: "2px solid #192230",
                        borderRadius: "12px",
                        padding: "30px 20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
                        Pro Plan
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#afaaaa", textAlign: "center" }}>
                        Perfect for small to mid-sized malls
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: "bold",color:"#3B82F6" }}>
                        $49/mo
                    </Typography>
                    <Box sx={{ textAlign: "center", color: "#afaaaa" }}>
                        <Typography>- Unlimited Tenants</Typography>
                        <Typography>- Real-time Analytics</Typography>
                        <Typography>- Auto Invoicing</Typography>
                        <Typography>- Support Included</Typography>
                    </Box>
                    <Button variant="outlined">Get Started</Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Pricing;
