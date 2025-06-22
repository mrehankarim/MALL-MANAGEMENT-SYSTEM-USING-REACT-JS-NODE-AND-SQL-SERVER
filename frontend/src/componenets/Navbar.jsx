import React, { useContext } from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  Divider,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({ SignUp, SignIn, setSignUp, setSignIn }) => {
  const location = useLocation();
  const theme = useTheme();
  const colorMode = useContext(ThemeContext);

  const getActiveStyle = (hash) => ({
    textDecoration: 'none',
    color:
      (location.hash === hash || (hash === "#hero" && location.hash === "")) 
        ? theme.palette.primary.main 
        : theme.palette.text.primary,
  });

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>MallMatrix</Typography>
            
            <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <HashLink smooth to="#hero" style={getActiveStyle("#hero")}>
                <Typography variant="body1">Home</Typography>
              </HashLink>
              <HashLink smooth to="#about" style={getActiveStyle("#about")}>
                <Typography variant="body1">About</Typography>
              </HashLink>
              <HashLink smooth to="#pricing" style={getActiveStyle("#pricing")}>
                <Typography variant="body1">Pricing</Typography>
              </HashLink>
              <HashLink smooth to="#contact" style={getActiveStyle("#contact")}>
                <Typography variant="body1">Contact Us</Typography>
              </HashLink>
            </Box>
            
            <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSignUp(prev => !prev);
                  setSignIn(false);
                }}
                sx={{
                  borderRadius: theme.shape.borderRadius,
                  fontWeight: 500
                }}
              >
                Sign Up
              </Button>
              
              <Button 
                variant="contained" 
                onClick={() => {
                  setSignIn(prev => !prev);
                  setSignUp(false);
                }}
                sx={{
                  ml: 1,
                  borderRadius: theme.shape.borderRadius,
                  fontWeight: 500
                }}
              >
                Login
              </Button>
            </Box>
          </Toolbar>
        </Container>
        <Divider />
      </AppBar>
    </>
  );
};

export default Navbar;