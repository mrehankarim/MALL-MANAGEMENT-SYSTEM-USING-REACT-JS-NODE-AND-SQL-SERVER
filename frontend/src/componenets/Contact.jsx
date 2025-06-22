import React from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';

const Contact = () => {
    return (
        <Container
            id="contact"
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
                maxWidth: "1100px",
                gap: 6,
                p: 4,
                }}
            >
                <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    Let's Connect
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
                    Have questions about MallMatrix? Reach out—we're here to help.
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    Our team is happy to chat about your needs.
                </Typography>
                </Box>

                <Box
                sx={{
                    flex: 1,
                    maxWidth: "500px",
                    width: '100%',
                    border: "1px solid",
                    borderColor: 'divider',
                    borderRadius: "12px",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
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
                    rows={4}
                    variant="outlined"
                />
                <Button 
                    variant="contained" 
                    sx={{ 
                    alignSelf: 'flex-end',
                    borderRadius: '8px',
                    px: 4
                    }}
                >
                    Send
                </Button>
                </Box>
            </Box>
            </Container>
    );
};

export default Contact;
