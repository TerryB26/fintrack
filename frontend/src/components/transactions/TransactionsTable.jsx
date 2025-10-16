/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Box, IconButton, Tooltip, CircularProgress, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { IoPencil, IoEyeOutline } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import CircularProgressWithLabel from '../general/CircularProgressWithLabel';
import { BsFiletypePdf } from "react-icons/bs";


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

const TransactionsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const filteredRequests = [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (request = null, editMode = false) => {
    setSelectedRequest(request);
    setIsEditMode(editMode);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
//replace null with data loading state !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  if (false) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height: '20vh' }}>
        <CircularProgressWithLabel />
      </Box>
    );
  }
//replace null with data loading state !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  if (false) {
    return <Typography variant="body1" color="error">Error loading data</Typography>;
  }

  return (
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
          placeholder='Search by !!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
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
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <AddRequestButton variant="contained" startIcon={<BsFiletypePdf size={20} />} onClick={() => handleOpenDialog()}>
          Export Transactions
        </AddRequestButton>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead style={{ backgroundColor: '#B8D0EB' }}>
            <TableRow style={{ backgroundColor: '#B8D0EB' }}>
            <TableCell sx={{ backgroundColor: '#B8D0EB !important', fontWeight: 'bold' }}>1</TableCell>
              <TableCell sx={{ backgroundColor: '#B8D0EB !important', fontWeight: 'bold' }}>2</TableCell>
              <TableCell sx={{ backgroundColor: '#B8D0EB !important', width: '250px', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(request => (
                <TableRow key={request.DictionaryID} sx={{
                  '&:hover': {
                    backgroundColor: '#E4F2FF',
                  },
                }}>
                  <TableCell>1</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell sx={{ width: '250px' }}>
                    {/* <Tooltip title="View">
                      <IconButton sx={{ color: '#82D8FF' }} onClick={() => handleOpenDialog(request)}>
                        <IoEyeOutline />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenDialog(request, true)}>
                        <IoPencil />
                      </IconButton>
                    </Tooltip> */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No records to display
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

    </Box>
  );
};

export default TransactionsTable;