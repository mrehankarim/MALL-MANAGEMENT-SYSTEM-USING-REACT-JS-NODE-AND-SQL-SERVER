import React from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import cover from '../assets/cover.png'
const Hero = () => {
    return (
        <>
            <Container id="hero" style={{ position:'relative',top:"64px", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box style={{ height: "90%", width: "100%", display: "flex", justifyContent: "center", alignItems: 'center', gap: "15px", flexDirection: "column", border: "2px solid #192230",borderRadius:"10px" }}>
                    <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center" }}>Get your mall managed <br /> by MallMatrix</Typography>
                    <Typography variant="p" sx={{ textAlign: "center", color: "#afaaaa" }}>Reach millions of consumers who are using <br /> MallMatrix to manage their malls
                    </Typography>
                    <Button variant='outlined'>sign up</Button>
                </Box>
            </Container>
            <Container maxWidth="lg" style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",border: "2px solid #192230",borderRadius:"10px" }}>
                <img src={cover} alt="" />
            </Container>
        </>
    )
}

export default Hero
