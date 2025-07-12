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
const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
    matchPaths: ['/dashboard']
  },
  {
    text: 'Product & Services',
    icon: <Category />,
    path: '/items',
    matchPaths: ['/items', '/add-items', '/item-list']
  },
];

const salesItems = [
  {
    text: 'Customers',
    icon: <People />,
    path: '/customer',
    matchPaths: ['/customer', '/add-customer', '/customer-list']
  },
  {
    text: 'Quotation',
    icon: <RequestQuote />,
    path: '/quotation',
    matchPaths: ['/quotation', '/add-quotation', '/quotation-list']
  },
  {
    text: 'Invoice',
    icon: <ReceiptLong />,
    path: '/invoice',
    matchPaths: ['/invoice', '/new-invoice', '/invoice-list']
  },
  {
    text: 'Pro Forma Invoice',
    icon: <Assignment />,
    path: '/pro-forma-Invoice',
    matchPaths: ['/pro-forma-Invoice', '/new-pro-forma-Invoice', '/pro-forma-Invoice-list']
  },
];

const purchaseItems = [
  {
    text: 'Purchase Order',
    icon: <ShoppingCart />,
    path: '/purchase-order',
    matchPaths: ['/purchase-order', '/add-purchase-order', '/purchase-order-list']
  },
  {
    text: 'Vendors',
    icon: <Business />,
    path: '/vendors',
    matchPaths: ['/vendors','/add-vendor','/vendor-list']
  },
  {
    text: 'Work Order',
    icon: <Construction />,
    path: '/Work-Order',
    matchPaths: ['/Work-Order','/add-Work-Order','/Work-Order-list']
  },
];

const othersItems = [
  {
    text: 'Tax',
    icon: <Gavel />,
    path: '/tax',
    matchPaths: ['/tax','/add-tax'],
  },
  {
    text: 'Financial Year Settings',
    icon: <EventNote />,
    path: '/add-Financial-year-settings',
    matchPaths: ['/add-Financial-year-settings']
  },
  {
    text: 'Report & Analytics',
    icon: <BarChart />,
    path: '/Report-and-Analytics',
    matchPaths: ['/Report-and-Analytics']
  },
  {
    text: 'Payment Settings',
    icon: <Payments />,
    path: '/payment-settings',
    matchPaths: ['/payment-settings','/add-payment-settings']
  },
  {
    text: 'Settings',
    icon: <Settings />,
    path: '/settings',
    matchPaths: ['/settings'],
  },
];



    const activeColor = '#004085';
    const hoverColor = '#fff';
    const ListSection = ({ title, items, location }) => {
  const activeColor = '#004085';
  const hoverColor = '#fff';

  return (
    <>
      <Typography sx={{ mt: 2, mb: 1, fontWeight: 'bold', pl: 2, fontSize: 12, color: '#777' }}>
        {title}
      </Typography>
      {items.map((item) => {
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


export default Sidebar;
