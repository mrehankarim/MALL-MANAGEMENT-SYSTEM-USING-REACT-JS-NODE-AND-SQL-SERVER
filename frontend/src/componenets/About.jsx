import React from 'react';
import { Container, Typography, Box } from "@mui/material";
import cover from '../assets/cover.png';

const About = () => {
    return (
        <Container id="about" maxWidth="lg" style={{ border: "2px solid #192230",borderRadius:"10px", marginTop: "30px", padding: "40px 20px" }}>
            
              
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '40px',
                    width: '100%',
                }}
            >
                {/* Left Column - Text Content */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body1">
                        <strong>Mall Matrix</strong> is an all-in-one, cloud-based mall management solution offered as Software as a Service (SaaS). Designed to streamline daily operations, it unifies key functions like tenant management, real-time analytics, and financial tracking under one intuitive platform. Mall owners and administrators can effortlessly handle lease agreements, monitor rent collection, track visitor footfall, and generate insightful reports — all from a centralized, easy-to-access dashboard.
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Whether you're managing a single mall or a multi-property portfolio, <strong>Mall Matrix</strong> scales to meet your needs. With robust data security, automation tools, and real-time operational insights, it cuts down on manual tasks and boosts efficiency. From automated billing and maintenance tracking to seamless communication with tenants, Mall Matrix delivers a modern, tech-driven experience tailored for the future of retail management.
                    </Typography>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={cover}
                        alt="Mall Matrix Overview"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '400px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                        }}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default About;
