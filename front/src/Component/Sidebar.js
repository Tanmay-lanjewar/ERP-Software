import {
  Box,
  Typography,
  Drawer,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
} from '@mui/material';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import ui from '../assets/ui.png';
import {
  Dashboard,
  Category,
  People,
  RequestQuote,
  ReceiptLong,
  Assignment,
  ShoppingCart,
  Business,
  Construction,
  Gavel,
  EventNote,
  BarChart,
  Payments,
  Settings,
  Logout,
} from '@mui/icons-material';

const Sidebar = ({ active }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      visible: true,
    },
    {
      text: 'Invoice',
      icon: <ReceiptLong />,
      path: '/invoice',
      visible: role === 'superadmin',
    },
    {
      text: 'Quotation',
      icon: <RequestQuote />,
      path: '/Quotation',
      visible: role === 'superadmin',
    },
    {
      text: 'Customer',
      icon: <People />,
      path: '/customer',
      visible: true,
    },
    {
      text: 'Product & Services',
      icon: <Category />,
      path: '/items',
      visible: true,
    },
    {
      text: 'Purchase Order',
      icon: <ShoppingCart />,
      path: '/purchase-order',
      visible: true,
    },
    {
      text: 'Vendors',
      icon: <Business />,
      path: '/vendors',
      visible: true,
    },
    {
      text: 'Work Order',
      icon: <Construction />,
      path: '/Work-Order',
      visible: true,
    },
    {
      text: 'Pro Forma Invoice',
      icon: <Assignment />,
      path: '/pro-forma-invoice',
      visible: true,
    },
    {
      text: 'Tax',
      icon: <Gavel />,
      path: '/Tax',
      visible: true,
    },
    {
      text: 'Financial Year',
      icon: <EventNote />,
      path: '/add-financial-year-settings',
      visible: true,
    },
    {
      text: 'Payment Settings',
      icon: <Payments />,
      path: '/Payment-settings',
      visible: true,
    },
    {
      text: 'Reports & Analytics',
      icon: <BarChart />,
      path: '/Report-and-analytics',
      visible: true,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          bgcolor: '#1a237e',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <img src={ui} alt="Logo" style={{ width: 150, marginBottom: 16 }} />
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        {menuItems
          .filter((item) => item.visible)
          .map((item) => (
            <NavLink
              key={item.text}
              to={item.path}
              style={{ textDecoration: 'none' }}
            >
              <Button
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  mb: 0.5,
                  color: location.pathname === item.path ? '#1a237e' : 'white',
                  bgcolor:
                    location.pathname === item.path ? 'white' : 'transparent',
                  '&:hover': {
                    bgcolor:
                      location.pathname === item.path
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.1)',
                  },
                  borderRadius: '8px',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? '#1a237e' : 'white',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </Button>
            </NavLink>
          ))}

        {/* Logout Button */}
        <Button
          fullWidth
          onClick={handleLogout}
          sx={{
            justifyContent: 'flex-start',
            px: 2,
            py: 1.5,
            mt: 2,
            color: 'white',
            bgcolor: 'transparent',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
            borderRadius: '8px',
          }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 14,
            }}
          />
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
