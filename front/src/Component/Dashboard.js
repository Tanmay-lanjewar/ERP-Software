import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  InputBase,
  IconButton,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../redux/slices/dashboardSlice';

// Recharts imports
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { totalInvoices, recentInvoices, invoicesOverTime, loading, error, paid, partial, draft } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const dataInvoiceStatus = [
    { name: "Paid", value: parseInt(paid) || 0, color: "#2E7D32" },
    { name: "Partial", value: parseInt(partial) || 0, color: "#FFA726" },
    { name: "Draft", value: parseInt(draft) || 0, color: "#C62828" },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "70vh", bgcolor: "#F9FAFB" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box
          sx={{
            height: 60,
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            px: 3,
            justifyContent: "space-between",
            bgcolor: "#fff",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Dashboard
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "transparent",
                border: "1px solid #e0e0e0",
                px: 2,
                py: 0.5,
                borderRadius: "20px",
                minWidth: 250,
              }}
            >
              <SearchIcon fontSize="small" sx={{ color: "#888" }} />
              <InputBase
                placeholder="Search anything here..."
                sx={{
                  ml: 1,
                  flex: 1,
                  fontSize: 14,
                  "&::placeholder": { color: "#888" },
                }}
              />
            </Box>
            <IconButton>
              <NotificationsNoneIcon sx={{ color: "#555" }} />
            </IconButton>
            <UserMenu />
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {/* Left Column: Recent Invoices and Invoices Over Time */}
            <Grid size={6} item xs={12} md={6}>
              {/* Recent Invoices */}
              <Paper sx={{ p: 2, borderRadius: 2, mb: 6, height: "auto" }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Recent Invoices
                </Typography>
                <Box>
                  {recentInvoices.map((invoice) => (
                    <Box
                      key={invoice.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={0}
                    >
                      <Box>
                        <Typography fontWeight="bold" lineHeight={1.5}>
                          {invoice.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          lineHeight={2.0}
                        >
                          {invoice.client_name}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Chip
                          label={invoice.status}
                          size="small"
                          sx={{
                            bgcolor:
                              invoice.status === "Completed"
                                ? "#E6F4EA"
                                : "#FEEAEA",
                            color:
                              invoice.status === "Completed"
                                ? "#2E7D32"
                                : "#C62828",
                            fontWeight: "bold",
                          }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {new Date(invoice.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box mt={2} textAlign="right">
                  <Link
                    to="/invoices"
                    style={{ textDecoration: "none", color: "#004085" }}
                  >
                    View All
                  </Link>
                </Box>
              </Paper>

              {/* Invoices Over Time */}
              <Paper sx={{ p: 3, borderRadius: 2, height: "auto" }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Invoices Over Time
                </Typography>
                <Box
                  sx={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 0.5,
                    py: 1,
                  }}
                >
                  <ResponsiveContainer width="120%" height="100%">
                    <BarChart
                      data={invoicesOverTime}
                      margin={{
                        top: 5,
                        right: 25,
                        left: -20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} />
                      <Tooltip />
                      <Bar
                        dataKey="invoices"
                        fill="#2E7D32"
                        barSize={20}
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column: Invoice Summary, Invoice Status, Reports, Invoice Status Pie Chart */}
            <Grid size={6} item xs={12} md={6}>
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                {/* Invoice Summary */}
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    mb: 2,
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Invoice Summary
                  </Typography>
                  <Box textAlign="center" mt={4} mb={1}>
                    <Typography variant="h2" fontWeight="bold" color="#004085">
                      {totalInvoices}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total number of Invoices
                    </Typography>
                  </Box>
                </Paper>

                {/* Invoice Status */}
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    mb: 2,
                    height: "auto",
                    width: "52%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Invoice Status{" "}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-around"
                    mt={4}
                    mb={1}
                    sx={{ flexWrap: 'wrap', gap: 2 }}
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                          border: "1px solid #D3D3D3",
                          p: 1,
                          borderRadius: 1,
                          color: "#2E7D32",
                        }}
                      >
                        {paid || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Paid
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                          border: "1px solid #D3D3D3",
                          p: 1,
                          borderRadius: 1,
                          color: "#FFA726",
                        }}
                      >
                        {partial || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Partial
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                          border: "1px solid #D3D3D3",
                          p: 1,
                          borderRadius: 1,
                          color: "#C62828",
                        }}
                      >
                        {draft || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Draft
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Reports */}
              <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Reports
                </Typography>
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#004085",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#003060" },
                    }}
                  >
                    All Invoices
                  </Button>
                 
                </Box>
              </Paper>

              {/* Invoice Status Pie Chart */}
              <Paper sx={{ p: 1, borderRadius: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={0.5}>
                  Invoice Status
                </Typography>
                <Box sx={{ width: '100%', height: 300, position: 'relative', py: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: -10, right: 0, bottom: -10, left: 0 }}>
                      <Pie
                        data={dataInvoiceStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dataInvoiceStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} invoices`, name]}
                        contentStyle={{ 
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ mt: 0.5, display: "flex", justifyContent: "center", gap: 2 }}>
                  {dataInvoiceStatus.map((entry, index) => {
                    const total = dataInvoiceStatus.reduce((sum, item) => sum + (item.value || 0), 0);
                    const percentage = total > 0 ? Math.round((entry.value / total) * 100) : 0;
                    return (
                      <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: entry.color,
                            borderRadius: "50%",
                            border: '2px solid #fff',
                            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {entry.name} ({entry.value}) - {percentage}%
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;