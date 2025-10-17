/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import PageHeader from '../components/general/PageHeader';
import { MdAccountBalance } from "react-icons/md";
import { FaPiggyBank } from "react-icons/fa6";
import TinyLineChart from '../components/charts/TinyLineChart';
import Piechart from '../components/charts/Piechart';
import { MdOutlineRssFeed } from "react-icons/md";
import { TiChartPie } from "react-icons/ti";
import { CgMoreO } from "react-icons/cg";
import { MdLock } from "react-icons/md";
import { MdCurrencyExchange } from "react-icons/md";
import { GiPayMoney } from "react-icons/gi";
import Modal from '../components/general/Modal';
import TransferForm from '../components/transactions/transfers/TransferForm';
import ExchangeForm from '../components/transactions/exchanges/ExchangeForm';
import { RiExchange2Line } from "react-icons/ri";
import { IoLogoEuro } from "react-icons/io";
import { IoLogoUsd } from "react-icons/io";
import CircularProgressWithLabel from '../components/general/CircularProgressWithLabel';
import { transactionsAPI, accountsAPI } from '../services/api';
import { IoWallet } from "react-icons/io5";


const Dashboard = ({ user }) => {
  const { id }  = user || {};
  
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('ALL'); 
  const [accountBalances, setAccountBalances] = useState({ EUR: 0, USD: 0, total: 0 });
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const fetchTransactions = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await transactionsAPI.getTransactions({ limit: 100, page: 1 });
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccountBalances = async () => {
    if (!id) return;
    
    setBalanceLoading(true);
    try {
      const response = await accountsAPI.getAccounts();
      console.log("🚀 ~ fetchAccountBalances ~ response:", response);
      const accounts = response.data || [];
      console.log("🚀 ~ fetchAccountBalances ~ accounts:", accounts);
      
      const balances = accounts.reduce((acc, account) => {
        const balance = parseFloat(account.balance) || 0;
        
        if (account.currency === 'EUR') {
          acc.EUR += balance;
        } else if (account.currency === 'USD') {
          acc.USD += balance;
        }
        acc.total += balance;
        return acc;
      }, { EUR: 0, USD: 0, total: 0 });
      
      //console.log("🚀 ~ fetchAccountBalances ~ calculated balances:", balances);
      setAccountBalances(balances);
    } catch (error) {
      console.error('Error fetching account balances:', error);
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccountBalances();
  }, [id]);

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedAccount === 'ALL') return true;
    if (selectedAccount === 'EUR') {
      return transaction.currency === 'EUR' || 
             transaction.fromCurrency === 'EUR' || 
             transaction.toCurrency === 'EUR';
    }
    if (selectedAccount === 'USD') {
      return transaction.currency === 'USD' || 
             transaction.fromCurrency === 'USD' || 
             transaction.toCurrency === 'USD';
    }
    return true;
  });

  const getSpendingData = () => {
    if (selectedAccount === 'ALL') return [];
    
    const withdrawals = filteredTransactions.filter(t => 
      t.transactionType === 'withdrawal' || t.transactionType === 'exchange'
    );

    const spendingMap = withdrawals.reduce((acc, transaction) => {
      const category = transaction.description || 'Other';
      const amount = Math.abs(parseFloat(transaction.amount) || 0);
      
      if (acc[category]) {
        acc[category] += amount;
      } else {
        acc[category] = amount;
      }
      return acc;
    }, {});

    return Object.entries(spendingMap).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  };

  const spendingData = getSpendingData();

  const handleAccountSwitch = (account) => {
    setSelectedAccount(account);
    handleMenuClose(setAnchorEl2);
  };

  const handleMenuOpen = (event, setAnchor) => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = (setAnchor) => {
    setAnchor(null);
  };

  const handleModalOpen = (title, setAnchor) => {
    setModalTitle(title);
    setModalOpen(true);
    setAnchor(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalTitle('');
  };

  // console.log("🚀 ~ Dashboard ~ transactions:", transactions)

  const renderModalContent = () => {
    switch (modalTitle) {
      case 'Transfer':
        return (
          <>
            <TransferForm handleClose={handleModalClose} />
          </>
        );
      
      case 'Exchange':
        return (
          <> 
            <ExchangeForm handleClose={handleModalClose} />
          </>
        );
      
      default:
        return (
          <Typography>
            No content available
          </Typography>
        );
    }
  };
  //add confirmation swal for switching accounts  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  return (
    <>
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

      <Box sx={{ maxWidth: '1800px', margin: '0 auto', mt: 4 }}>
        <Grid container spacing={1}>
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
                      {selectedAccount === 'ALL' ? 'All Accounts' : selectedAccount === 'EUR' ? 'EUR Account' : 'USD Account'}
                    </Typography>
                    
                    {selectedAccount !== 'ALL' && (
                      balanceLoading ? (
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: '#415A77'
                          }}
                        >
                          Loading...
                        </Typography>
                      ) : (
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: '#1E293B'
                          }}
                        >
                          {selectedAccount === 'EUR' 
                            ? `€${accountBalances.EUR.toFixed(2)}` 
                            : `$${accountBalances.USD.toFixed(2)}`}
                        </Typography>
                      )
                    )}
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#415A77'
                      }}
                    >
                      Manage your financial accounts and track their performance
                    </Typography>
                    
                    <Box sx={{ position: 'absolute', bottom: 5, right: 5, display: 'flex', gap: 1 }}>
                      
                      <Tooltip title="Transactions" arrow placement="top">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, setAnchorEl1)}
                          sx={{
                            color: '#6f2dbd',
                            '&:hover': {
                              color: '#320d6d',
                              backgroundColor: 'rgba(0, 180, 216, 0.1)'
                            }
                          }}
                        >
                          <CgMoreO size={22} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Switch Accounts" arrow placement="top">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, setAnchorEl2)}
                          sx={{
                            color: '#6f2dbd',
                            '&:hover': {
                              color: 'black',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)'
                            }
                          }}
                        >
                          <RiExchange2Line size={22} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Menu
                      anchorEl={anchorEl2}
                      open={Boolean(anchorEl2)}
                      onClose={() => handleMenuClose(setAnchorEl2)}
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
                          borderLeft: "4px solid #6f2dbd",
                          borderRadius: 2
                        }
                      }}
                    >
                      <MenuItem 
                        onClick={() => handleAccountSwitch('ALL')}
                        sx={{
                          display: 'flex',
                          gap: 1.5,
                          alignItems: 'center',
                          backgroundColor: selectedAccount === 'ALL' ? '#E3F2FD' : 'transparent',
                          '&:hover': {
                            backgroundColor: '#E3F2FD'
                          }
                        }}
                      >
                        <IoWallet size={20} style={{ color: '#6f2dbd' }} />
                        <Typography sx={{ fontWeight: selectedAccount === 'ALL' ? 'bold' : 'normal' }}>
                          All Accounts
                        </Typography>
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleAccountSwitch('EUR')}
                        sx={{
                          display: 'flex',
                          gap: 1.5,
                          alignItems: 'center',
                          backgroundColor: selectedAccount === 'EUR' ? '#E3F2FD' : 'transparent',
                          '&:hover': {
                            backgroundColor: '#E3F2FD'
                          }
                        }}
                      >
                        <IoLogoEuro size={20} style={{ color: '#6f2dbd' }} />
                        <Typography sx={{ fontWeight: selectedAccount === 'EUR' ? 'bold' : 'normal' }}>
                          EUR Account
                        </Typography>
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleAccountSwitch('USD')}
                        sx={{
                          display: 'flex',
                          gap: 1.5,
                          alignItems: 'center',
                          backgroundColor: selectedAccount === 'USD' ? '#E3F2FD' : 'transparent',
                          '&:hover': {
                            backgroundColor: '#E3F2FD'
                          }
                        }}
                      >
                        <IoLogoUsd size={20} style={{ color: '#6f2dbd' }} />
                        <Typography sx={{ fontWeight: selectedAccount === 'USD' ? 'bold' : 'normal' }}>
                          USD Account
                        </Typography>
                      </MenuItem>
                    </Menu>
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
                      <MenuItem 
                        onClick={() => handleModalOpen('Transfer', setAnchorEl1)}
                        sx={{
                          display: 'flex',
                          gap: 1.5,
                          alignItems: 'center',
                          '&:hover': {
                            backgroundColor: '#E3F2FD'
                          }
                        }}
                      >
                        <GiPayMoney size={20} style={{ color: '#00B4D8' }} />
                        <Typography>Transfer</Typography>
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleModalOpen('Exchange', setAnchorEl1)}
                        sx={{
                          display: 'flex',
                          gap: 1.5,
                          alignItems: 'center',
                          '&:hover': {
                            backgroundColor: '#E3F2FD'
                          }
                        }}
                      >
                        <MdCurrencyExchange size={20} style={{ color: '#00B4D8' }} />
                        <Typography>Exchange</Typography>
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
                      {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                          <CircularProgressWithLabel />
                        </Box>
                      ) : isError ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" sx={{ color: '#EF4444', mb: 2 }}>
                            Failed to load transactions
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ color: '#3B82F6', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={fetchTransactions}
                          >
                            Try again
                          </Typography>
                        </Box>
                      ) : filteredTransactions.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" sx={{ color: '#64748B' }}>
                            No transactions found for {selectedAccount === 'ALL' ? 'any account' : `${selectedAccount} account`}
                          </Typography>
                        </Box>
                      ) : (
                        filteredTransactions.slice(0, 5).map((transaction) => (
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
                                  {transaction.description || transaction.transactionType || 'Transaction'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                  {new Date(transaction.transactionDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })} • {transaction.currency || transaction.fromCurrency || transaction.toCurrency || 'USD'}
                                </Typography>
                              </Box>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  color: transaction.transactionType === 'deposit' ? '#10B981' : '#EF4444' 
                                }}
                              >
                                {transaction.transactionType === 'deposit' ? '+' : '-'}{transaction.currency || transaction.fromCurrency || 'USD'} {Math.abs(transaction.amount).toFixed(2)}
                              </Typography>
                            </Box>
                          </Paper>
                        ))
                      )}
                    </Box>
                   
                  </Paper>
                </Grid>

                <Grid item size={7}>
                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: 2,
                      p: 3,
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
                      <Piechart 
                        data={spendingData} 
                        selectedAccount={selectedAccount}
                        currency={selectedAccount === 'EUR' ? '€' : '$'}
                      />
                    </Box>

                  </Paper>
                </Grid>

              </Grid>
            </Box>

          </Grid>
        </Grid>
      </Box>

      <Modal 
        open={modalOpen} 
        onClose={handleModalClose}
        title={modalTitle}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default Dashboard;
