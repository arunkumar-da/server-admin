import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import logo from '../images/logo.png'; // Ensure this path is correct

import './header.css';
const Header = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar >
        <Toolbar>
          
          <img src={logo} alt="Company Logo" /> 
   
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;