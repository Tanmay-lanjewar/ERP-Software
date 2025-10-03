import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithGoogle, signupWithGoogle, setRole, loginWithCredentials } from '../redux/slices/authSlice';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState('');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    dispatch(setRole(event.target.value));
  };

  const handleCredentialsChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert('Please select a role first');
      return;
    }
    try {
      const result = await dispatch(loginWithCredentials(credentials)).unwrap();
      if (result.user.role !== selectedRole) {
        alert('Selected role does not match your account role');
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleGoogleLogin = async () => {
    if (!selectedRole) {
      alert('Please select a role first');
      return;
    }
    try {
      await dispatch(loginWithGoogle({ role: selectedRole })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleGoogleSignup = async () => {
    if (!selectedRole) {
      alert('Please select a role first');
      return;
    }
    try {
      await dispatch(signupWithGoogle({ role: selectedRole })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          borderRadius: 2,
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: 60, marginBottom: 16 }}
          />
          <Typography variant="h5" fontWeight="bold" color="primary">
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please sign in to continue
          </Typography>
        </Box>

        {/* Role Selector */}
        <FormControl fullWidth>
          <InputLabel>Select Role</InputLabel>
          <Select
            value={selectedRole}
            onChange={handleRoleChange}
            label="Select Role"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="superadmin">Super Admin</MenuItem>
          </Select>
        </FormControl>

        {/* Credentials Login Form */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Sign in with Credentials
          </Typography>
          <form onSubmit={handleCredentialsLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={credentials.username}
                onChange={handleCredentialsChange}
                variant="outlined"
                placeholder="e.g., admin@erp.com"
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleCredentialsChange}
                variant="outlined"
                placeholder="Enter your password"
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !selectedRole}
                sx={{ 
                  bgcolor: '#1976d2', 
                  color: 'white', 
                  '&:hover': { bgcolor: '#1565c0' },
                  py: 1.5
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign in'}
              </Button>
            </Box>
          </form>
        </Box>

        <Divider sx={{ my: 2 }}>OR</Divider>

        {/* Google Sign-in Options */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" align="center" gutterBottom>
            Continue with Google
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            disabled={loading || !selectedRole}
            sx={{
              borderColor: '#4285F4',
              color: '#4285F4',
              '&:hover': { bgcolor: '#f5f9ff' },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign in with Google'}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignup}
            disabled={loading || !selectedRole}
            sx={{ 
              borderColor: '#4285F4', 
              color: '#4285F4',
              '&:hover': { bgcolor: '#f5f9ff' },
            }}
          >
            Sign up with Google
          </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Credentials Info */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Test Credentials:<br />
          Admin: admin@erp.com / password123<br />
          Super Admin: superadmin@erp.com / password123
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;