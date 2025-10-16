import { Box, Container, Paper, Typography } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#00B4D8',
                mb: 1,
              }}
            >
              FinTrack
            </Typography>
            <Box
              component="img"
              src="/finance-animate.svg"
              alt="FinTrack Logo"
              sx={{
                width: 220,
                height: 220,
                mx: 'auto',
                mb: 2,
              }}
            />

            <Typography
              variant="body1"
              sx={{
                color: '#64748B',
              }}
            >
              Sign in to your account
            </Typography>
          </Box>
          
          <LoginForm />
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
