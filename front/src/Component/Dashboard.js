import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../redux/slices/dashboardSlice';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ReceiptLong,
  RequestQuote,
  People,
  Category,
  ShoppingCart,
  Business,
  Construction,
  Assignment,
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const {
    totalInvoices,
    paid,
    partial,
    draft,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchDashboardData()).unwrap();
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchData();
  }, [dispatch]);

  const dataInvoiceStatus = [
    { name: 'Paid', value: parseInt(paid) || 0, color: '#4CAF50' },
    { name: 'Partial', value: parseInt(partial) || 0, color: '#FFC107' },
    { name: 'Draft', value: parseInt(draft) || 0, color: '#9E9E9E' },
  ];

  const quickLinks = [
    {
      title: 'Invoice',
      icon: <ReceiptLong />,
      path: '/invoice',
      visible: role === 'superadmin',
    },
    {
      title: 'Quotation',
      icon: <RequestQuote />,
      path: '/quotation',
      visible: role === 'superadmin',
    },
    {
      title: 'Customers',
      icon: <People />,
      path: '/customer',
      visible: true,
    },
    {
      title: 'Products',
      icon: <Category />,
      path: '/items',
      visible: true,
    },
    {
      title: 'Purchase Orders',
      icon: <ShoppingCart />,
      path: '/purchase-order',
      visible: true,
    },
    {
      title: 'Vendors',
      icon: <Business />,
      path: '/vendors',
      visible: true,
    },
    {
      title: 'Work Orders',
      icon: <Construction />,
      path: '/work-order',
      visible: true,
    },
    {
      title: 'Pro Forma',
      icon: <Assignment />,
      path: '/pro-forma-invoice',
      visible: true,
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Links */}
        {quickLinks
          .filter((link) => link.visible)
          .map((link) => (
            <Grid item xs={12} sm={6} md={3} key={link.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        mr: 2,
                      }}
                    >
                      {link.icon}
                    </Box>
                    <Typography variant="h6">{link.title}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

        {/* Invoice Status Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              minHeight: 400,
              p: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Invoice Status
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={dataInvoiceStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {dataInvoiceStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: theme.shadows[2],
                  }}
                  formatter={(value) => [`${value} Invoices`, '']}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => {
                    const { payload } = entry;
                    const percentage = (
                      (payload.value / totalInvoices) *
                      100
                    ).toFixed(1);
                    return `${value} (${percentage}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
