import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import dash from '../assets/dash.png';

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <img
          src={dash}
          alt="Dashboard"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '100%',
            objectFit: 'contain', // use "cover" if you want full coverage
          }}
        />
      </Box>
    </Box>
  );
}

