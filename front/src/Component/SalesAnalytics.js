import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  InputBase,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';
import axios from 'axios';

const SalesAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const periods = [
    { value: 'monthly', label: 'Monthly', icon: '📅' },
    { value: 'quarterly', label: 'Quarterly', icon: '📊' },
    { value: 'six_months', label: '6 Months', icon: '📈' },
    { value: 'yearly', label: 'Yearly', icon: '🗓️' },
  ];

  const fetchAnalytics = async (period) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/invoice/analytics/sales?period=${period}`);
      setAnalyticsData(response.data[0] || null);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedPeriod);
  }, [selectedPeriod]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const formatCurrency = (amount) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
    return `₹${formattedAmount}`;
  };

  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <Card 
      sx={{ 
        height: '100%', 
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${color}25`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '12px', 
            backgroundColor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          {trend && (
            <Chip 
              icon={trend > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${Math.abs(trend)}%`}
              size="small"
              color={trend > 0 ? 'success' : 'error'}
              variant="outlined"
            />
          )}
        </Box>
        <Typography variant="h4" fontWeight="bold" color={color} sx={{ mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#fff',
            p: 2,
            px: 3,
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarTodayIcon sx={{ color: '#3b82f6' }} />
            <Typography variant="h5" fontWeight="bold" color="#1e293b">
              Sales Analytics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f1f5f9',
                px: 2,
                py: 0.5,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              }}
            >
              <SearchIcon fontSize="small" sx={{ mr: 1, color: '#64748b' }} />
              <InputBase placeholder="Search analytics..." sx={{ fontSize: '14px' }} />
            </Box>
            <IconButton sx={{ color: '#64748b' }}>
              <NotificationsNoneIcon />
            </IconButton>
            <UserMenu />
            <Avatar src="/avatar.png" sx={{ width: 32, height: 32 }} />
            <Typography fontSize={14} color="#64748b">Admin</Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, flexGrow: 1 }}>
          {/* Period Filter Buttons */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: '16px', 
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'white' }}>
              📊 Sales Performance Dashboard
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
              Analyze your sales data across different time periods
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {periods.map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? 'contained' : 'outlined'}
                  onClick={() => handlePeriodChange(period.value)}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    backgroundColor: selectedPeriod === period.value ? 'rgba(255,255,255,0.2)' : 'transparent',
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                  }}
                  startIcon={<span style={{ fontSize: '16px' }}>{period.icon}</span>}
                >
                  {period.label}
                </Button>
              ))}
            </Box>
          </Paper>

          {/* Analytics Content */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: '#3b82f6' }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: '12px', mb: 3 }}>
              {error}
            </Alert>
          ) : analyticsData ? (
            <>
              {/* Period Info */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', mb: 3, border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color="#1e293b">
                    📈 {analyticsData.period_label} Overview
                  </Typography>
                  <Chip 
                    label={analyticsData.period_name} 
                    color="primary" 
                    variant="outlined"
                    sx={{ borderRadius: '8px' }}
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Comprehensive sales analysis for the selected time period
                </Typography>
              </Paper>

              {/* Stats Grid */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Total Invoices"
                    value={analyticsData.total_invoices}
                    icon={<ReceiptIcon sx={{ fontSize: 28, color: '#3b82f6' }} />}
                    color="#3b82f6"
                    subtitle="All invoices created"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Completed Invoices"
                    value={analyticsData.completed_invoices}
                    icon={<CheckCircleIcon sx={{ fontSize: 28, color: '#10b981' }} />}
                    color="#10b981"
                    subtitle="Paid invoices"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Pending Invoices"
                    value={analyticsData.pending_invoices}
                    icon={<PendingActionsIcon sx={{ fontSize: 28, color: '#f59e0b' }} />}
                    color="#f59e0b"
                    subtitle="Awaiting payment"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Average Invoice"
                    value={formatCurrency(analyticsData.average_invoice_amount)}
                    icon={<AttachMoneyIcon sx={{ fontSize: 28, color: '#8b5cf6' }} />}
                    color="#8b5cf6"
                    subtitle="Per invoice amount"
                  />
                </Grid>
              </Grid>

              {/* Amount Breakdown */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <StatCard
                    title="Total Revenue"
                    value={formatCurrency(analyticsData.total_amount)}
                    icon={<AttachMoneyIcon sx={{ fontSize: 32, color: '#059669' }} />}
                    color="#059669"
                    subtitle="Total invoice amount"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StatCard
                    title="Completed Revenue"
                    value={formatCurrency(analyticsData.completed_amount)}
                    icon={<CheckCircleIcon sx={{ fontSize: 32, color: '#10b981' }} />}
                    color="#10b981"
                    subtitle="From paid invoices"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StatCard
                    title="Pending Revenue"
                    value={formatCurrency(analyticsData.pending_amount)}
                    icon={<PendingActionsIcon sx={{ fontSize: 32, color: '#f59e0b' }} />}
                    color="#f59e0b"
                    subtitle="From pending invoices"
                  />
                </Grid>
              </Grid>

              {/* Summary Card */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: '16px', 
                  mt: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  💡 Key Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Collection Rate: {analyticsData.total_invoices > 0 ? 
                        Math.round((analyticsData.completed_invoices / analyticsData.total_invoices) * 100) : 0}%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Revenue Realization: {analyticsData.total_amount > 0 ? 
                        Math.round((analyticsData.completed_amount / analyticsData.total_amount) * 100) : 0}%
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Pending Rate: {analyticsData.total_invoices > 0 ? 
                        Math.round((analyticsData.pending_invoices / analyticsData.total_invoices) * 100) : 0}%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Outstanding Amount: {formatCurrency(analyticsData.pending_amount)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </>
          ) : (
            <Paper elevation={0} sx={{ p: 6, borderRadius: '16px', textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                📊 No Data Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No sales data found for the selected period.
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SalesAnalytics;
