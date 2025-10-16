import './App.css';
import Layout from './components/Layout';
import { Box, Grid, Typography, Paper, IconButton, Menu, MenuItem } from '@mui/material';
import PageHeader from './components/general/PageHeader';
import { MdAccountBalance } from "react-icons/md";
import { FaPiggyBank } from "react-icons/fa6";
import TinyLineChart from './components/charts/TinyLineChart';
import { MdOutlineRssFeed } from "react-icons/md";
import { TiChartPie } from "react-icons/ti";
import { CgMoreO } from "react-icons/cg";
import { MdLock } from "react-icons/md";
import { useState } from 'react';

function App() {
  // Dummy transactions data
  const transactions = [
    { id: 1, name: 'Grocery Store', date: 'Oct 15, 2025', amount: -125.50 },
    { id: 2, name: 'Salary Deposit', date: 'Oct 14, 2025', amount: 3500.00 },
    { id: 3, name: 'Gas Station', date: 'Oct 13, 2025', amount: -45.00 },
    { id: 4, name: 'Netflix Subscription', date: 'Oct 12, 2025', amount: -15.99 },
    { id: 5, name: 'Coffee Shop', date: 'Oct 11, 2025', amount: -5.75 }
  ];

  // State for menu anchors (one for each account card)
  const [anchorEl1, setAnchorEl1] = useState(null);

  const handleMenuOpen = (event, setAnchor) => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = (setAnchor) => {
    setAnchor(null);
  };

  const handleMenuAction = (action, setAnchor) => {
    console.log(`${action} clicked`);
    setAnchor(null);
    // Add your action logic here
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: '1800px', margin: '0 auto', mb: 0 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: '#B8D0EB',
            borderBottom: "4px solid #00B4D8",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              color: '#00B4D8'
            }}
          >
            Welcome to FinTrack
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              color: '#415A77'
            }}
          >
            Your personal finance tracking dashboard is ready to help you manage your money effectively.
          </Typography>
        </Paper>
      </Box>

      {/* Four sections in a row */}
      <Box sx={{ maxWidth: '1800px', margin: '0 auto', mt: 4 }}>
        <Grid container spacing={1}>
          {/* Left Column - Accounts */}
          <Grid item size={3}>
            <Box sx={{ maxWidth: 430 }}>
              <PageHeader 
                title="Accounts" 
                subtitle="Manage your financial accounts"
                bgColor="#F0F9FF"
                textColor="#0F172A"
                icon={<MdAccountBalance />}
              />
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={4} direction="column" alignItems="start">
                <Grid item xs={12}>
                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: 2,
                      borderLeft: "4px solid #3980e9",
                      p: 2.5,
                      textAlign: 'center',
                      backgroundColor: '#B8D0EB',
                      height: '100%',
                      minHeight: 180,
                      maxWidth: 450,
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                        backgroundColor: '#C8E0F5'
                      }
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        color: '#00B4D8'
                      }}
                    >
                      Main Account
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#415A77'
                      }}
                    >
                      Manage your financial accounts and track their performance.
                    </Typography>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, setAnchorEl1)}
                      sx={{
                        position: 'absolute',
                        bottom: 5,
                        right: 5,
                        color: '#415A77',
                        '&:hover': {
                          color: '#00B4D8',
                          backgroundColor: 'rgba(0, 180, 216, 0.1)'
                        }
                      }}
                    >
                      <CgMoreO size={24} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl1}
                      open={Boolean(anchorEl1)}
                      onClose={() => handleMenuClose(setAnchorEl1)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      sx={{
                        '& .MuiPaper-root': {
                          borderLeft: "4px solid #3980e9",
                          borderRadius: 2
                        }
                      }}
                    >
                      <MenuItem onClick={() => handleMenuAction('Transaction', setAnchorEl1)}>
                        Transaction
                      </MenuItem>
                      <MenuItem onClick={() => handleMenuAction('Exchange', setAnchorEl1)}>
                        Exchange
                      </MenuItem>
                    </Menu>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: 2,
                      borderLeft: "4px solid #3980e9",
                      p: 2.5,
                      textAlign: 'center',
                      backgroundColor: '#adadad',
                      height: '100%',
                      minHeight: 180,
                      maxWidth: 450,
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                        backgroundColor: '#C8E0F5'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                      <MdLock size={24} style={{ color: 'black' }} />
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: 'bold',
                          color: 'white'
                        }}
                      >
                        Savings Account
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white'
                      }}
                    >
                      Manage your financial accounts and track their performance.
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: 2,
                      borderLeft: "4px solid #3980e9",
                      p: 2.5,
                      textAlign: 'center',
                      backgroundColor: '#adadad',
                      height: '100%',
                      minHeight: 180,
                      maxWidth: 450,
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                        backgroundColor: '#C8E0F5'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                      <MdLock size={24} style={{ color: 'black' }} />
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: 'bold',
                          color: 'white'
                        }}
                      >
                        Fixed Account
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white'
                      }}
                    >
                      Manage your financial accounts and track their performance.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Column - Overview */}
          <Grid item size={9}>
            <PageHeader 
              title="Overview" 
              subtitle="Financial summary and insights"
              bgColor="#F0F9FF"
              textColor="#0F172A"
              icon={<FaPiggyBank />}
            />
            
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>

                <Grid item size={5}>
                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: 2,
                      p: 3,
                      //backgroundColor: '#B8D0EB',
                      height: '100%',
                      minHeight: 600,
                      borderLeft: "4px solid #B298DC",

                    }}
                  >

                    <Box sx={{  }}>
                      <PageHeader 
                        title="Transactions" 
                        subtitle="Manage your financial accounts"
                        bgColor="#F0F9FF"
                        textColor="#0F172A"
                        icon={<MdOutlineRssFeed />}
                        iconColor="black"
                      />
                    </Box>
                   
                    <Box sx={{ mt: 2 }}>
                      {transactions.map((transaction) => (
                        <Paper
                          key={transaction.id}
                          elevation={1}
                          sx={{
                            p: 2,
                            mb: 1,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            backgroundColor: '#f7faed',
                            borderBottom: '1px solid #e8f6fd',
                            '&:hover': {
                              backgroundColor: '#E3F2FD',
                              transform: 'translateX(5px)',
                              boxShadow: 3
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ textAlign: 'left' }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0F172A' }}>
                                {transaction.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748B' }}>
                                {transaction.date}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 'bold', 
                                color: transaction.amount >= 0 ? '#10B981' : '#EF4444' 
                              }}
                            >
                              {transaction.amount >= 0 ? '+' : ''}{transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                   
                  </Paper>
                </Grid>

                <Grid item size={7}>
                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: 2,
                      p: 3,
                      //backgroundColor: '#B8D0EB',
                      height: '100%',
                      minHeight: 200,
                      borderLeft: "4px solid #B8D0EB",

                    }}
                  >
                    <Box sx={{  }}>
                      <PageHeader 
                        title="Spendings" 
                        subtitle="Manage your financial accounts"
                        bgColor="#F0F9FF"
                        textColor="#0F172A"
                        icon={<TiChartPie />}
                        iconColor="black"
                      />
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <TinyLineChart />
                    </Box>

                  </Paper>
                </Grid>

              </Grid>
            </Box>

          </Grid>
        </Grid>
      </Box>


    </Layout>
  );
}

export default App;
