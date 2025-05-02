import React from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';

const Contact = () => {
    return (
        <Container
        id="contact"
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
                    maxWidth: "1100px",
                    gap: "40px",
                    padding: "20px",
                }}
            >
                {/* Left Column - Copywriting */}
                <Box style={{ flex: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                        Let’s Connect
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#afaaaa", mb: 2 }}>
                        Have questions about MallMatrix or want to learn more about how we can support your mall’s operations? Reach out to us—we’re here to help.
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#afaaaa" }}>
                        Whether you're ready to get started or just exploring, our team is happy to chat.
                    </Typography>
                </Box>

                {/* Right Column - Contact Form */}
                <Box
                    style={{
                        flex: 1,
                        maxWidth: "500px",
                        minHeight: "500px",
                        border: "2px solid #192230",
                        borderRadius: "12px",
                        padding: "40px 30px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "25px",
                        justifyContent: "center",
                    }}
                >
                    <TextField
                        fullWidth
                        label="Your Name"
                        variant="outlined"
                        size="medium"
                    />
                    <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        size="medium"
                    />
                    <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={6}
                        variant="outlined"
                    />
                    <Button variant="outlined">Send Message</Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Contact;
