import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import TransactionsTable from '../components/transactions/TransactionsTable';

const Transactions = ({ user }) => {
  return (
    <Box sx={{ maxWidth: '1800px', margin: '0 auto', p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          p: 3,
          backgroundColor: '#F0F9FF',
          borderLeft: "4px solid #00B4D8",
          mb: 3
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#00B4D8',
            mb: 1
          }}
        >
          Transactions
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#415A77'
          }}
        >
          View and manage all your financial transactions
        </Typography>
      </Paper>

      <TransactionsTable user={user} />
    </Box>
  );
};

export default Transactions;
