import {
    Box,
    Typography,
    Button, Paper, InputBase, IconButton,
    Avatar
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Sidebar from './Sidebar';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
const illustration = 'https://i0.wp.com/cupofglory.com/wp-content/uploads/2024/11/Subscription-Form.webp?resize=1024,912&ssl=1';

export default function CustomerPage() {
    const navigate = useNavigate();
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />

            <Box sx={{ flex: 1, minHeight: '100vh' }}>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 4,
                        py: 2,
                        bgcolor: 'white',
                        borderBottom: '1px solid #e0e0e0',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Customer
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '999px',
                                border: '1px solid #e0e0e0',
                                bgcolor: '#f9fafb',
                                width: 240,
                            }}
                        >
                            <SearchIcon sx={{ fontSize: 20, color: '#999' }} />
                            <InputBase
                                placeholder="Search anything here..."
                                sx={{ ml: 1, fontSize: 14, flex: 1 }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Paper>

                        <IconButton
                            sx={{
                                borderRadius: '12px',
                                border: '1px solid #e0e0e0',
                                bgcolor: '#f9fafb',
                                p: 1,
                            }}
                        >
                            <NotificationsNoneIcon sx={{ fontSize: 20, color: '#666' }} />
                        </IconButton> <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        bgcolor: 'white',
                        m: 4,
                        borderRadius: 2,
                        py: 8,
                        px: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}
                >
                    <img
                        src={illustration}
                        alt="Customer Illustration"
                        style={{ width: 200, marginBottom: 20 }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Add New Customer
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: '#777', mt: 1, textAlign: 'center' }}
                    >
                        Add and manage your customer, all in one place.
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 3,
                            backgroundColor: '#004085',
                            borderRadius: '6px',
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#003366',
                            },
                        }}
                        onClick={() => navigate('/add-customer')}
                    >
                        + New Customer
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
