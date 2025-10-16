import { TextField, Box, Button, FormControl, FormGroup, Grid, Alert } from "@mui/material";
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().required('Password is required'),
  });

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, resetForm } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setError('');
      try {
        await login(values.email, values.password);
        navigate('/');
      } catch (err) {
        setError(err.message || 'Login failed. Please check your credentials.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2.5}>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <FormGroup>
                <FormControl variant="outlined" fullWidth>
                  <TextField
                    size="small"
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={submitting}
                  />
                </FormControl>
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <FormGroup>
                <FormControl variant="outlined" fullWidth>
                  <TextField
                    size="small"
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    disabled={submitting}
                  />
                </FormControl>
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
                sx={{
                  backgroundColor: '#00B4D8',
                  color: 'white',
                  py: 1.2,
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#0096C7',
                  },
                }}
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Box>
  );
};

export default LoginForm;