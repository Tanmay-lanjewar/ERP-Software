import React from "react";
import {
  Box,
  Grid,
  Typography,
  InputBase,
  IconButton,
  Avatar,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom"; // Import Link for navigation
import Sidebar from "./Sidebar";
import ui from "../assets/ui.png";

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
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const dataInvoicesOverTime = [
    { name: "Jan", invoices: 10 },
    { name: "Feb", invoices: 15 },
    { name: "Mar", invoices: 21 },
    { name: "Apr", invoices: 18 },
    { name: "May", invoices: 13 },
    { name: "June", invoices: 18 },
  ];

  const dataInvoiceStatus = [
    { name: "Completed", value: 53, color: "#2E7D32" },
    { name: "Pending", value: 34, color: "#C62828" },
  ];

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
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                src={"https://i.pravatar.cc/40?img=1"}
                sx={{ width: 30, height: 30 }}
              />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon sx={{ color: "#555" }} />
            </Box>
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
                  {[
                    {
                      id: 1,
                      name: "INV-001",
                      client: "Client A",
                      status: "Pending",
                      date: "Apr 20",
                    },
                    {
                      id: 2,
                      name: "INV-002",
                      client: "Client B",
                      status: "Pending",
                      date: "Apr 22",
                    },
                    {
                      id: 3,
                      name: "INV-003",
                      client: "Client C",
                      status: "Completed",
                      date: "Apr 18",
                    },
                    {
                      id: 4,
                      name: "INV-004",
                      client: "Client D",
                      status: "Completed",
                      date: "Apr 15",
                    },
                  ].map((invoice) => (
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
                          {invoice.client}
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
                          {invoice.date}
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
                      data={dataInvoicesOverTime}
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
                      87
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
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                          border: "1px solid #D3D3D3",
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        34
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Pending
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
                        }}
                      >
                        53
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Completed
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
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#f0f0f0",
                      color: "#004085",
                      textTransform: "none",
                      "&:hover": { borderColor: "#ccc", color: "#003060" },
                    }}
                  >
                    Customer
                  </Button>
                </Box>
              </Paper>

              {/* Invoice Status Pie Chart */}
              <Paper sx={{ p: 2, borderRadius: 2, height: "40%" }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Invoice Status
                </Typography>
                <Box
                  sx={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 0.5,
                    py: 1,
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataInvoiceStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                      >
                        {dataInvoiceStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box display="flex" justifyContent="center" gap={3} mt={2}>
                  <Typography variant="body2">
                    <span style={{ color: "#2E7D32" }}>•</span> Completed - 53%
                  </Typography>
                  <Typography variant="body2">
                    <span style={{ color: "#C62828" }}>•</span> Pending - 34%
                  </Typography>
                  <Typography variant="body2">Total - 87%</Typography>
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
