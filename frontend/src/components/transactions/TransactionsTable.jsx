/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Box, IconButton, Tooltip, CircularProgress, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { IoPencil, IoEyeOutline } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import CircularProgressWithLabel from '../general/CircularProgressWithLabel';
import { BsFiletypePdf } from "react-icons/bs";
import { transactionsAPI } from '../../services/api';
import Modal from '../general/Modal';


const PaginationContainer = styled('div')(({ theme }) => ({
  '& .MuiTablePagination-selectRoot': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiTablePagination-select': {
    minWidth: '50px',
  },
}));

const AddRequestButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderLeft: "4px solid #3980e9",
  borderRight: "4px solid #3980e9",
  textTransform: "none",
  '&:hover': {
    backgroundColor: "#ECEBF9",
  },
}));

const TransactionsTable = ({user}) => {
  const { id }  = user || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCurrency, setFilterCurrency] = useState('all');

  const fetchTransactions = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await transactionsAPI.getTransactions({ limit: 100, page: 1 });
      console.log("🚀 ~ fetchTransactions ~ response:", response)
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [id]);

  console.log("🚀 ~ TransactionsTable ~ transactions:", transactions)

  const filteredRequests = transactions.filter(transaction => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        transaction.description?.toLowerCase().includes(query) ||
        transaction.transactionType?.toLowerCase().includes(query) ||
        transaction.currency?.toLowerCase().includes(query) ||
        transaction.fromCurrency?.toLowerCase().includes(query) ||
        transaction.toCurrency?.toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filterType !== 'all') {
      if (transaction.transactionType !== filterType) return false;
    }

    // Currency filter
    if (filterCurrency !== 'all') {
      const transactionCurrency = transaction.currency || transaction.fromCurrency || transaction.toCurrency;
      if (transactionCurrency !== filterCurrency) return false;
    }

    return true;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterCurrency('all');
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenDialog = (request = null, editMode = false) => {
    setSelectedRequest(request);
    setIsEditMode(editMode);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
    setIsEditMode(false);
  };

  const renderModalContent = () => {
    if (!selectedRequest) return null;

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
            Transaction Date
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0F172A' }}>
            {new Date(selectedRequest.transactionDate).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
            Description
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0F172A' }}>
            {selectedRequest.description || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
            Transaction Type
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#0F172A',
              textTransform: 'capitalize'
            }}
          >
            {selectedRequest.transactionType}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
            Currency
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0F172A' }}>
            {selectedRequest.currency || selectedRequest.fromCurrency || selectedRequest.toCurrency || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
            Amount
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold',
              color: selectedRequest.transactionType === 'deposit' ? '#10B981' : '#EF4444'
            }}
          >
            {selectedRequest.transactionType === 'deposit' ? '+' : '-'}
            {selectedRequest.currency || selectedRequest.fromCurrency || 'USD'} {Math.abs(selectedRequest.amount).toFixed(2)}
          </Typography>
        </Box>

        {selectedRequest.transactionType === 'exchange' && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
                From Currency
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0F172A' }}>
                {selectedRequest.fromCurrency} {Math.abs(selectedRequest.amount).toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
                To Currency
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0F172A' }}>
                {selectedRequest.toCurrency} {Math.abs(selectedRequest.exchangedAmount || 0).toFixed(2)}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height: '20vh' }}>
        <CircularProgressWithLabel />
      </Box>
    );
  }

  if (isError) {
    return <Typography variant="body1" color="error">Error loading transactions</Typography>;
  }

  return (
    <>
      <Box 
        sx={{
          borderRadius: 2,
          borderLeft: "4px solid #3980e9",
          p: 2.5,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            label="Search"
            placeholder='Search by description, type, or currency'
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            style={{ marginRight: '20px' }}
            InputProps={{
              style: {
                height: '40px',
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#00B4D8',
                },
                '&:hover fieldset': {
                  borderColor: '#ff0000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00B4D8',
                },
              },
            }}
          />
          <Button
            color="secondary"
            onClick={handleClearSearch}
            startIcon={<SearchOffIcon sx={{ color: 'black', fontSize: '10px' }} />}
            sx={{
              height: '40px',
              color: 'black',
              fontSize: '12px',
              padding: '8px 16px',
              '&:hover': {
                borderBottom: '1px solid #ff0000',
                backgroundColor: '#F3F4F6',
                color: '#ff0000',
              },
            }}
          >
            Clear
          </Button>
        </Box>

        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            label="Filter by Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            SelectProps={{
              native: true,
            }}
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#00B4D8',
                },
                '&:hover fieldset': {
                  borderColor: '#3980e9',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00B4D8',
                },
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="exchange">Exchange</option>
          </TextField>

          <TextField
            select
            label="Filter by Currency"
            value={filterCurrency}
            onChange={(e) => setFilterCurrency(e.target.value)}
            SelectProps={{
              native: true,
            }}
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#00B4D8',
                },
                '&:hover fieldset': {
                  borderColor: '#3980e9',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00B4D8',
                },
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            <option value="all">All Currencies</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </TextField>

          <Button
            onClick={handleClearFilters}
            sx={{
              '&:hover': {
                borderBottom: '1px solid #00B4D8',
                backgroundColor: '#F3F4F6',
              },
            }}
          >
            Clear All Filters
          </Button>
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <AddRequestButton variant="contained" startIcon={<BsFiletypePdf size={20} />} disabled>
            Export Transactions
          </AddRequestButton>
        </Box>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead style={{ backgroundColor: '#B8D0EB' }}>
              <TableRow style={{ backgroundColor: '#B8D0EB' }}>
                <TableCell sx={{ backgroundColor: '#B8D0EB !important', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ backgroundColor: '#B8D0EB !important', fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ backgroundColor: '#B8D0EB !important', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ backgroundColor: '#B8D0EB !important', fontWeight: 'bold' }}>Currency</TableCell>
                <TableCell sx={{ backgroundColor: '#B8D0EB !important', fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ backgroundColor: '#B8D0EB !important', width: '250px', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(transaction => (
                  <TableRow key={transaction.id} sx={{
                    '&:hover': {
                      backgroundColor: '#E4F2FF',
                    },
                  }}>
                    <TableCell>
                      {new Date(transaction.transactionDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </TableCell>
                    <TableCell>{transaction.description || transaction.transactionType || 'N/A'}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{transaction.transactionType}</TableCell>
                    <TableCell>{transaction.currency || transaction.fromCurrency || transaction.toCurrency || 'N/A'}</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 'bold',
                      color: transaction.transactionType === 'deposit' ? '#10B981' : '#EF4444'
                    }}>
                      {transaction.transactionType === 'deposit' ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ width: '250px' }}>
                      <Tooltip title="View">
                        <IconButton sx={{ color: '#82D8FF' }} onClick={() => handleOpenDialog(transaction)}>
                          <IoEyeOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <PaginationContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRequests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </PaginationContainer>

        <Modal 
          open={openDialog} 
          onClose={handleCloseDialog}
          title={isEditMode ? 'Edit Transaction' : 'Transaction Details'}
        >
          {renderModalContent()}
        </Modal>
      </Box>
    </>
  );
};

export default TransactionsTable;