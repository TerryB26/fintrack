import './App.css';
import Layout from './components/Layout';
import { Box, Grid, Typography, Paper } from '@mui/material';
import PageHeader from './components/general/PageHeader';
import { MdAccountBalance } from "react-icons/md";

function App() {
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

        <PageHeader 
          title="Accounts" 
          subtitle="Manage your financial accounts"
          bgColor="#F0F9FF"
          textColor="#0F172A"
          icon={<MdAccountBalance />}
        />
        
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={4} justifyContent="center">
          {/* Accounts Section */}
          <Grid item xs={12} sm={6} lg={3}>
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
                maxWidth: 300
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
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
            </Paper>
          </Grid>

          {/* Balance Section */}
          <Grid item xs={12} sm={6} lg={3}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                borderLeft: "4px solid #724cf9",
                p: 2.5,
                textAlign: 'center',
                backgroundColor: '#B8D0EB',
                height: '100%',
                minHeight: 180,
                maxWidth: 300
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: '#00B4D8'
                }}
              >
                Savings Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#415A77'
                }}
              >
                View your current balance and financial overview.
              </Typography>
            </Paper>
          </Grid>

          {/* Banking Section */}
          <Grid item xs={12} sm={6} lg={3}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                borderLeft: "4px solid #9e65f9",
                p: 2.5,
                textAlign: 'center',
                backgroundColor: '#B8D0EB',
                height: '100%',
                minHeight: 180,
                maxWidth: 300
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: '#00B4D8'
                }}
              >
                Cheque Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#415A77'
                }}
              >
                Connect and manage your banking transactions.
              </Typography>
            </Paper>
          </Grid>

          {/* Transactions Section */}
          <Grid item xs={12} sm={6} lg={3}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                borderLeft: "4px solid #ca7df9",
                p: 2.5,
                textAlign: 'center',
                backgroundColor: '#B8D0EB',
                height: '100%',
                minHeight: 180,
                maxWidth: 300
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: '#00B4D8'
                }}
              >
                Stocks Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#415A77'
                }}
              >
                Track and categorize all your financial transactions.
              </Typography>
            </Paper>
          </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}

export default App;
