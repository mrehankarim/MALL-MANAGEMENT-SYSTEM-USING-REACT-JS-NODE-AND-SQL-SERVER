import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Navbar = ({SignUp,SignIn,setSignUp,setSignIn}) => {
  const location = useLocation();
  const theme = useTheme();

  const getActiveStyle = (hash) => ({
    textDecoration: 'none',
    color:
      (location.hash === hash || (hash === "#hero" && location.hash === "")) 
        ? '#3B82F6' 
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
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5">MallMatrix</Typography>
            <Box sx={{ display: 'flex', gap: '20px' }}>
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
            <Box>
              <Button variant="outlined" onClick={()=>{
                setSignUp(prev=>!prev)
                setSignIn(false)
              }}>Sign Up</Button>
              <Button variant="outlined" sx={{ ml: 1 }} onClick={()=>{
                setSignIn(prev=>!prev)
                setSignUp(false)
              }}>
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
