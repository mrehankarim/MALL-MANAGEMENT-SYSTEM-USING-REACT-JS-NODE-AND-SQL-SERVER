import React from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import cover from '../assets/cover.png'
const Hero = () => {
    return (
        <>
            <Container id="hero" sx={{ 
                position: 'relative',
                top: "80px", 
                height: "calc(100vh - 80px)",
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                mb: 8
                }}>
                <Box sx={{ 
                    height: "90%", 
                    width: "100%", 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: 'center', 
                    gap: 3, 
                    flexDirection: "column", 
                    border: "1px solid", 
                    borderColor: 'divider',
                    borderRadius: "12px",
                    p: 4,
                    backgroundColor: 'background.paper',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                }}>
                    <Typography variant="h3" sx={{ 
                    fontWeight: 700, 
                    textAlign: "center",
                    lineHeight: 1.2
                    }}>
                    Get your mall managed <br /> <Box component="span" sx={{ color: 'primary.main' }}>MallMatrix</Box>
                    </Typography>
                    <Typography variant="body1" sx={{ 
                    textAlign: "center", 
                    color: "text.secondary",
                    maxWidth: '600px'
                    }}>
                    Reach millions of consumers who are using MallMatrix to manage their malls
                    </Typography>
                    <Button 
                    variant='contained' 
                    size='large'
                    sx={{
                        mt: 2,
                        px: 4,
                        color: 'black',
                        borderRadius: '8px'
                    }}
                    >
                    Get Started
                    </Button>
                    <Box sx={{ 
            width: '100px', 
            height: '1px', 
            bgcolor: 'divider' 
          }} />
          <Box sx={{
          mt: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'text.secondary'
        }}>
          <Box sx={{ 
            width: '100px', 
            height: '1px', 
            bgcolor: 'divider' 
          }} />
          <Typography variant="caption">Trusted by 500+ malls worldwide</Typography>
          <Box sx={{ 
            width: '100px', 
            height: '1px', 
            bgcolor: 'divider' 
          }} />
        </Box>
      </Box>
    </Container>
        </>
    )
}

export default Hero
