import { TextField, Box, Button, FormControl, FormGroup, Grid, Alert, InputAdornment, IconButton } from "@mui/material";
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { AiOutlineLogin } from "react-icons/ai";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
          <Grid container spacing={2}>
            {error && (
              <Grid item xs={12}>
                <Alert 
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#FEF2F2',
                    color: '#991B1B',
                    border: 'none',
                    '& .MuiAlert-icon': {
                      color: '#DC2626',
                    },
                  }}
                >
                  {error}
                </Alert>
              </Grid>
            )}

            <Grid item size={12}>
              <FormGroup>
                <FormControl variant="outlined" fullWidth>
                  <TextField
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={submitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon sx={{ color: '#94A3B8', fontSize: 22 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F8FAFC',
                        borderRadius: 2,
                        fontSize: '15px',
                        transition: 'all 0.2s ease',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover': {
                          backgroundColor: '#F1F5F9',
                          '& fieldset': {
                            borderColor: 'transparent',
                          },
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                          '& fieldset': {
                            borderColor: '#3B82F6',
                            borderWidth: '1px',
                          },
                        },
                        '&.Mui-error': {
                          '& fieldset': {
                            borderColor: '#EF4444',
                          },
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: '14px 12px',
                      },
                    }}
                  />
                </FormControl>
              </FormGroup>
            </Grid>

            <Grid item size={12}>
              <FormGroup>
                <FormControl variant="outlined" fullWidth>
                  <TextField
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    disabled={submitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: '#94A3B8', fontSize: 22 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#94A3B8' }}
                          >
                            {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F8FAFC',
                        borderRadius: 2,
                        fontSize: '15px',
                        transition: 'all 0.2s ease',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover': {
                          backgroundColor: '#F1F5F9',
                          '& fieldset': {
                            borderColor: 'transparent',
                          },
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                          '& fieldset': {
                            borderColor: '#3B82F6',
                            borderWidth: '1px',
                          },
                        },
                        '&.Mui-error': {
                          '& fieldset': {
                            borderColor: '#EF4444',
                          },
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: '14px 12px',
                      },
                    }}
                  />
                </FormControl>
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button
                  type="submit"
                  //variant="contained"
                  disabled={submitting}
                  startIcon={<AiOutlineLogin size={20} />}
                  sx={{
                    //backgroundColor: '#3B82F6',
                    color: 'black',
                    px: 2,
                    py: 1.5,
                    fontSize: '15px',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    borderBottom: '4px solid #00B4D8',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      //backgroundColor: '#2563EB',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      transform: 'translateY(-1px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#E2E8F0',
                      color: '#94A3B8',
                    },
                  }}
                >
                  {submitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Box>
  );
};

export default LoginForm;