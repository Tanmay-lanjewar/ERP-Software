import {
    Box,
    Typography,
    Drawer,
    ListItemIcon,
    ListItemText,
    Avatar,
    Button,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
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
} from '@mui/icons-material';

const Sidebar = () => {
    const location = useLocation();
    const userRole = localStorage.getItem('userRole');
    
    const filterMenuItemsByRole = (items) => {
      return items.filter(item => item.roles.includes(userRole));
    };
const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
    matchPaths: ['/dashboard'],
    roles: ['admin', 'superadmin']
  },
  {
    text: 'Product & Services',
    icon: <Category />,
    path: '/items',
    matchPaths: ['/items', '/add-items', '/item-list'],
    roles: ['superadmin']  // Changed to superadmin only
  },
];

const salesItems = [
  {
    text: 'Customers',
    icon: <People />,
    path: '/customer',
    matchPaths: ['/customer', '/add-customer', '/customer-list'],
    roles: ['admin', 'superadmin']
  },
  {
    text: 'Quotation',
    icon: <RequestQuote />,
    path: '/quotation',
    matchPaths: ['/quotation', '/add-quotation', '/quotation-list'],
    roles: ['admin', 'superadmin']  // Added admin role
  },
  {
    text: 'Invoice',
    icon: <ReceiptLong />,
    path: '/invoice',
    matchPaths: ['/invoice', '/new-invoice', '/invoice-list'],
    roles: ['admin', 'superadmin']  // Added admin role
  },
];

const purchaseItems = [
  {
    text: 'Purchase Order',
    icon: <ShoppingCart />,
    path: '/purchase-order',
    matchPaths: ['/purchase-order', '/add-purchase-order', '/purchase-order-list'],
    roles: ['superadmin']
  },
  {
    text: 'Vendors',
    icon: <Business />,
    path: '/vendors',
    matchPaths: ['/vendors','/add-vendor','/vendor-list'],
    roles: ['superadmin']  // Changed to superadmin only
  },
  {
    text: 'Work Order',
    icon: <Construction />,
    path: '/Work-Order',
    matchPaths: ['/Work-Order','/add-Work-Order','/Work-Order-list'],
    roles: ['superadmin']
  },
];

const othersItems = [
  {
    text: 'Tax',
    icon: <Gavel />,
    path: '/tax',
    matchPaths: ['/tax','/add-tax'],
    roles: ['superadmin']
  },
  {
    text: 'Financial Year Settings',
    icon: <EventNote />,
    path: '/add-Financial-year-settings',
    matchPaths: ['/add-Financial-year-settings'],
    roles: ['superadmin']
  },
  {
    text: 'Report & Analytics',
    icon: <BarChart />,
    path: '/Report-and-Analytics',
    matchPaths: ['/Report-and-Analytics'],
    roles: ['superadmin']  // Changed to superadmin only
  },
  {
    text: 'Payment Settings',
    icon: <Payments />,
    path: '/payment-settings',
    matchPaths: ['/payment-settings','/add-payment-settings'],
    roles: ['superadmin']
  },
];



    const activeColor = '#004085';
    const hoverColor = '#fff';
    const ListSection = ({ title, items, location }) => {
  const activeColor = '#004085';
  const hoverColor = '#fff';
  const userRole = localStorage.getItem('userRole');

  const filteredItems = items.filter(item => !item.roles || item.roles.includes(userRole));

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <>
      <Typography sx={{ mt: 2, mb: 1, fontWeight: 'bold', pl: 2, fontSize: 12, color: '#777' }}>
        {title}
      </Typography>
      {filteredItems.map((item) => {
        const isActive = item.matchPaths.some((path) => location.pathname.startsWith(path));
        return (
          <NavLink to={item.path} key={item.text} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: isActive ? activeColor : '#f5f7fa',
                color: isActive ? '#fff' : '#333',
                '&:hover': {
                  bgcolor: isActive ? activeColor : hoverColor,
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#fff' : '#333' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </Box>
          </NavLink>
        );
      })}
    </>
  );
};

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 290,
                '& .MuiDrawer-paper': {
                    width: 290,
                    boxSizing: 'border-box',
                    p: 2,
                    bgcolor: '#fff',
                    borderRight: '1px solid #eee',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                <img
                    src={ui}
                    alt="Logo"
                    style={{ maxHeight: '250px', maxWidth: '200%', objectFit: 'contain', display: 'block' }}
                />
            </Box>
<Box
  sx={{
    flexGrow: 1,
    overflowY: 'auto',
    pr: 1, 
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c1c1c1',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f5f5f5',
    },
    scrollbarWidth: 'thin', 
    scrollbarColor: '#c1c1c1 #f5f5f5',
  }}
>

                <ListSection title="Menu" items={menuItems} location={location} />
                <ListSection title="Sales" items={salesItems} location={location} />
                <ListSection title="Purchases" items={purchaseItems} location={location} />
<ListSection title="Others" items={othersItems} location={location} />

               
            </Box>

      
        </Drawer>
    );
};


export default Sidebar;
