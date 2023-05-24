import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom'

const Whooops: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#F4F5FA',
      }}
    >
      <Typography variant="h1" style={{ color: purple[500] }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: purple[500] }}>
        The page you're looking for doesn't exist.
      </Typography>
      <Link to='/' style={{ textDecoration: 'none' }}>
        <Button variant="contained" style={{ marginTop: '30px' }}>Back Home</Button>  
      </Link>
    </Box>
  );
}

export default Whooops

