import {
  Box, Grid, Typography, TextField, Button, MenuItem, Tooltip,
  IconButton, InputAdornment, Paper, Breadcrumbs, InputBase, FormControl, Select, Avatar

} from '@mui/material';
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
const units = ['cm', 'mm', 'kg', 'pcs'];
const vendors = ['Laxmi Motors', 'ABC Traders'];
const taxes = ['GST 5%', 'GST 12%', 'None'];

export default function AddItems() {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar active="Items" />

      <Box sx={{ flex: 1, bgcolor: '#f9fafc', minHeight: '100vh' }}>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            mt: 1,
            px: 3
          }}
        >

          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Typography color="text.secondary" fontSize="14px">
              Product & Services
            </Typography>
            <Typography color="text.primary" fontWeight={600} fontSize="14px">
              Add
            </Typography>
          </Breadcrumbs>

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
            </IconButton>  
             <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/150?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Box>
        <Box sx={{ px: 4, py: 4 }}>

          <Paper sx={{ p: 1, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#111',
                mb: 2,
                borderBottom: '1px solid #eee',
                pb: 1,
              }}
            >
              New Product & Services
            </Typography>
            <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Customer Type</FormLabel>
            <RadioGroup row defaultValue="business">
              <FormControlLabel value="business" control={<Radio />} label="Product" />
              <FormControlLabel value="individual" control={<Radio />} label="Service" />
            </RadioGroup>
            <Grid container spacing={2} alignItems="center">

              <Grid container spacing={2}>

                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1 }}>Product Name*</Typography>
                  <TextField
                    fullWidth
                    placeholder="Shaft"
                    size="small"
                    sx={{
                      width: { xs: '100%', sm: '100%', md: 330 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        height: 40,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '10px',
                      },
                      '& input': {
                        fontSize: '14px',
                        padding: '10px 14px',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1 }}>SKU Code*</Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter code"
                    size="small"
                    sx={{
                      width: { xs: '100%', sm: '100%', md: 330 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        height: 40,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '10px',
                      },
                      '& input': {
                        fontSize: '14px',
                        padding: '10px 14px',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1 }}>Tax Applicable*</Typography>
                  <TextField
                    select
                    fullWidth
                    defaultValue="Tax"
                    size="small"
                    sx={{
                      width: { xs: '100%', sm: '100%', md: 330 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        height: 40,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '10px',
                      },
                      '& .MuiSelect-select': {
                        fontSize: '14px',
                        padding: '10px 14px',
                      },
                    }}
                  >
                    {taxes.map((tax) => (
                      <MenuItem key={tax} value={tax}>
                        {tax}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1 }}>Status*</Typography>
                  <TextField
                    select
                    fullWidth
                    defaultValue="Active"
                    size="small"
                    sx={{
                      width: { xs: '100%', sm: '100%', md: 330 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        height: 40,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '10px',
                      },
                      '& .MuiSelect-select': {
                        fontSize: '14px',
                        padding: '10px 14px',
                      },
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1 }}>Category*</Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter category"
                    size="small"
                    sx={{
                      width: { xs: '100%', sm: '100%', md: 330 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        height: 40,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '10px',
                      },
                      '& input': {
                        fontSize: '14px',
                        padding: '10px 14px',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 0, display: 'flex', alignItems: 'center', gap: 0 }}>
                    Unit*
                    <Tooltip title="The item will be measured in terms of this unit. (e.g. cm, kg etc)">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    defaultValue="kg"
                    size="small"
                    sx={{
                      width: { xs: '100%', sm: '100%', md: 330 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        height: 40,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '10px',
                      },
                      '& .MuiSelect-select': {
                        fontSize: '14px',
                        padding: '10px 14px',
                      },
                    }}
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

            </Grid>
            <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              Product Details
            </Typography>

            <Box display={'flex'} justifyContent={'space-between'}>
              <Grid item xs={12} md={6} >
                <Paper
                  elevation={0}
                  sx={{ p: -1, borderRadius: 2, height: '100%' }}
                >
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Sales Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography>Selling Price*</Typography>

                      <TextField
                        fullWidth
                        size="small"
                        defaultValue="30"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{
                                bgcolor: 'rgb(223, 228, 234)',
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                pl: 2.2,
                                pr: 1,
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                ml: 0,
                              }}
                            >
                              INR
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          width: { xs: '100%', sm: '100%', md: 450 },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            bgcolor: '#f9fafb',
                            height: 35,
                            paddingLeft: 0,
                          },
                          '& .MuiOutlinedInput-input': {
                            paddingLeft: 0,
                          },
                          '& .MuiInputAdornment-root': {
                            marginRight: 2,
                          },
                        }}
                      />

                    </Grid>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TextField
                        fullWidth
                        label="Discount*"
                        size="small"
                        defaultValue="2"
                        sx={{
                          width: { xs: '100%', sm: '100%', md: 367 },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            bgcolor: '#f9fafb',
                            height: 40,
                          },
                        }}
                      />

                      <FormControl
                        size="small"
                        sx={{
                          minWidth: 60,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            bgcolor: '#f9fafb',
                            height: 40,
                            px: 1,
                          },
                        }}
                      >
                        <Select
                          defaultValue="%"
                          displayEmpty
                          inputProps={{ 'aria-label': 'Discount Type' }}
                        >
                          <MenuItem value="%">%</MenuItem>
                          <MenuItem value="₹">₹</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        label="Item Description*"
                        placeholder="Type description"
                        sx={{
                          width: { xs: '100%', sm: '100%', md: 450 }
                          ,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            bgcolor: '#f9fafb', height: 40,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} ml={5} >
                <Paper
                  elevation={0}
                  sx={{ p: -1, borderRadius: 2, height: '100%' }}
                >
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Purchase Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography>Purchase Price*</Typography>

                      <TextField
                        fullWidth
                        size="small"
                        defaultValue="30"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{
                                bgcolor: 'rgb(223, 228, 234)',
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                pl: 2.2,
                                pr: 1,
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                ml: 0,
                              }}
                            >
                              INR
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          width: { xs: '100%', sm: '100%', md: 450 },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            bgcolor: '#f9fafb',
                            height: 35,
                            paddingLeft: 0,
                          },
                          '& .MuiOutlinedInput-input': {
                            paddingLeft: 0,
                          },
                          '& .MuiInputAdornment-root': {
                            marginRight: 2,
                          },
                        }}
                      />


                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <TextField
                          fullWidth
                          label="Discount *"
                          size="small"
                          defaultValue="2"
                          sx={{
                            width: { xs: '100%', sm: '100%', md: 367 },
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              bgcolor: '#f9fafb',
                              height: 40,
                            },
                          }}
                        />

                        <FormControl
                          size="small"
                          sx={{
                            minWidth: 60,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              bgcolor: '#f9fafb',
                              height: 40,
                              px: 1,
                            },
                          }}
                        >
                          <Select
                            defaultValue="%"
                            displayEmpty
                            inputProps={{ 'aria-label': 'Discount Type' }}
                          >
                            <MenuItem value="%">%</MenuItem>
                            <MenuItem value="₹">₹</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        label="Item Description*"
                        placeholder="Type description"
                        sx={{
                          width: { xs: '100%', sm: '100%', md: 450 }
                          ,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            bgcolor: '#f9fafb', height: 40
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Preferred Vendor"
                        defaultValue="Laxmi Motors"
                        sx={{
                          width: { xs: '100%', sm: '100%', md: 450 }
                          ,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            bgcolor: '#f9fafb',
                            height: 40,
                          },
                        }}
                      >
                        {vendors.map((vendor) => (
                          <MenuItem key={vendor} value={vendor}>
                            {vendor}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"

                sx={{ textTransform: 'none', borderRadius: 2, px: 4 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  bgcolor: '#004085',
                  '&:hover': { bgcolor: '#003366' }
                }}
                onClick={() => navigate('/item-list')}
              >
                Add
              </Button>
            </Box></Paper>
        </Box>
      </Box>
    </Box>
  );
}
