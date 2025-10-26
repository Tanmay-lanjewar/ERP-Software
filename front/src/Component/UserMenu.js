import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

export default function UserMenu() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState('');
  const isLoggedIn = Boolean(localStorage.getItem('username'));

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleClick = (event) => {
    if (isLoggedIn) {
      setAnchorEl(event.currentTarget);
    } else {
      navigate('/');
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('visibleComponents');
    
    handleClose();
    navigate('/');
  };

  return (
    <>
      <Box 
        display="flex" 
        alignItems="center" 
        gap={1} 
        sx={{ cursor: 'pointer' }}
        onClick={handleClick}
      >
        <Avatar sx={{ width: 32, height: 32 }} />
        <Typography fontSize={14}>
          {isLoggedIn ? username : 'Login'}
        </Typography>
        <ArrowDropDownIcon sx={{ color: "#555" }} />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { width: 200 } }}
      >
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
