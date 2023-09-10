import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6">
          Interfreight InvoiceGen
        </Typography>
        {/* Add any additional header content or navigation links here */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

