/* eslint-disable no-unused-vars */
import { MenuItem, TextField, Box, Button, FormControl, FormGroup, Grid, Autocomplete, Typography, Alert, CircularProgress } from "@mui/material";
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import * as yup from 'yup';
import FormButtons from'../../general/FormButtons';
import RequiredField from'../../general/RequiredField';
import Swal from 'sweetalert2';
import { transactionsAPI, accountsAPI } from '../../../services/api';
import { MdCurrencyExchange } from "react-icons/md";

const ExchangeForm = ({ handleClose, user, refreshData }) => {

  const EXCHANGE_RATE = 0.92; // 1 USD = 0.92 EUR (fixed rate)


  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountError, setAccountError] = useState("");
  const [fromAccountBalance, setFromAccountBalance] = useState(null);
  const [toAccountBalance, setToAccountBalance] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const validationObj = {
    fromAccount: yup.object().nullable().required("Source Account Required"),
    toAccount: yup.object().nullable().required("Target Account Required"),
    amount: yup.number().typeError("Please enter a valid number").positive("Amount must be positive").required("* Required"),
  };
  const validationSchema = yup.object(validationObj);

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, setFieldValue, resetForm } = useFormik({
    initialValues: {
      fromAccount: null,
      toAccount: null,
      amount: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const sourceAmount = parseFloat(values.amount);
        if (isNaN(sourceAmount) || !isFinite(sourceAmount) || sourceAmount <= 0) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Amount',
            text: 'Please enter a valid positive number for the amount.',
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'OK'
          });
          setSubmitting(false);
          return;
        }
        const exchangeData = {
          fromAccountId: values.fromAccount.id,
          toAccountId: values.toAccount.id,
          sourceAmount,
          // Round target amount to 2 decimal places before sending
          targetAmount: parseFloat(convertedAmount.toFixed(2)),
          exchangeRate: EXCHANGE_RATE,
          description: `Exchange ${values.fromAccount.currency} to ${values.toAccount.currency}`
        };
        console.log("🚀 ~ ExchangeForm ~ exchangeData:", exchangeData)
        await transactionsAPI.exchange(
          exchangeData.fromAccountId,
          exchangeData.toAccountId,
          exchangeData.sourceAmount,
          exchangeData.targetAmount,
          exchangeData.exchangeRate,
          exchangeData.description
        );
        Swal.fire({
          icon: 'success',
          title: 'Exchange Successful!',
          html: `
            <p>Successfully exchanged:</p>
            <p><strong>${values.amount} ${values.fromAccount.currency}</strong></p>
            <p>to</p>
            <p><strong>${convertedAmount.toFixed(2)} ${values.toAccount.currency}</strong></p>
            <p style="color: #64748B; font-size: 0.9em; margin-top: 10px;">Exchange Rate: 1 ${values.fromAccount.currency} = ${EXCHANGE_RATE} ${values.toAccount.currency}</p>
          `,
          confirmButtonColor: '#00B4D8',
          confirmButtonText: 'OK'
        });
        if (refreshData) refreshData();
        handleClearForm();
        handleClose();
      } catch (error) {
        console.error('Exchange error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Exchange Failed',
          text: error.response?.data?.message || error.message || 'An error occurred while processing your exchange. Please try again.',
          confirmButtonColor: '#EF4444',
          confirmButtonText: 'OK'
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        // Only fetch if user exists and has an id
        if (!user || !user.id) {
          setAccounts([]);
          setLoadingAccounts(false);
          setAccountError("No user found. Please log in.");
          return;
        }
        const arr = await accountsAPI.getAccounts();
        const unlocked = Array.isArray(arr) ? arr.filter(acc => !acc.isLocked) : [];
        setAccounts(unlocked);
        if (!unlocked || unlocked.length === 0) {
          setAccountError("No unlocked accounts found for this user.");
        } else {
          setAccountError("");
        }
      } catch (err) {
        setAccountError("Failed to load accounts");
        setAccounts([]);
      } finally {
        setLoadingAccounts(false);
      }
    };
    fetchAccounts();
  }, [user]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (values.fromAccount && values.fromAccount.id) {
        try {
          const res = await accountsAPI.getAccountBalance(values.fromAccount.id);
          setFromAccountBalance(res.data ? res.data.balance : null);
        } catch {
          setFromAccountBalance(null);
        }
      } else {
        setFromAccountBalance(null);
      }
    };
    fetchBalance();
  }, [values.fromAccount]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (values.toAccount && values.toAccount.id) {
        try {
          const res = await accountsAPI.getAccountBalance(values.toAccount.id);
          setToAccountBalance(res.data ? res.data.balance : null);
        } catch {
          setToAccountBalance(null);
        }
      } else {
        setToAccountBalance(null);
      }
    };
    fetchBalance();
  }, [values.toAccount]);

  useEffect(() => {
    if (values.amount && values.fromAccount && values.toAccount) {
      let converted = parseFloat(values.amount);
      if (values.fromAccount.currency === 'USD' && values.toAccount.currency === 'EUR') {
        converted = parseFloat(values.amount) * EXCHANGE_RATE;
      } else if (values.fromAccount.currency === 'EUR' && values.toAccount.currency === 'USD') {
        converted = parseFloat(values.amount) / EXCHANGE_RATE;
      }
      setConvertedAmount(converted);
    } else {
      setConvertedAmount(0);
    }
  }, [values.amount, values.fromAccount, values.toAccount]);
  // ...existing code...

  // Calculate converted amount whenever amount or accounts change
  useEffect(() => {
    if (values.amount && values.fromAccount && values.toAccount) {
      let converted = parseFloat(values.amount);
      if (values.fromAccount.currency === 'USD' && values.toAccount.currency === 'EUR') {
        converted = parseFloat(values.amount) * EXCHANGE_RATE;
      } else if (values.fromAccount.currency === 'EUR' && values.toAccount.currency === 'USD') {
        converted = parseFloat(values.amount) / EXCHANGE_RATE;
      }
      setConvertedAmount(converted);
    } else {
      setConvertedAmount(0);
    }
  }, [values.amount, values.fromAccount, values.toAccount]);


  const handleFromAccountChange = (event, newValue) => {
    setFieldValue('fromAccount', newValue);
  };
  const handleToAccountChange = (event, newValue) => {
    setFieldValue('toAccount', newValue);
  };

  const handleClearForm = () => {
    resetForm();
    setConvertedAmount(0);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box sx={{ flexGrow: 1 }}>
          {loadingAccounts ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
              <CircularProgress />
            </Box>
          ) : accounts.length === 0 ? (
            <Alert severity="warning">{accountError || "No accounts available. Please add an account first."}</Alert>
          ) : (
            <Grid container spacing={2} sx={{ p: 0 }}>
              {/* Exchange Rate Display */}
              <Grid item xs={12}>
                <Alert 
                  severity="info" 
                  icon={<MdCurrencyExchange size={20} />}
                  sx={{ 
                    backgroundColor: '#E0F2FE',
                    color: '#0F172A',
                    '& .MuiAlert-icon': {
                      color: '#00B4D8'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Current Exchange Rate: 1 USD = {EXCHANGE_RATE} EUR
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Fixed exchange rate for all transactions
                  </Typography>
                </Alert>
              </Grid>

              {/* From Account Dropdown */}
              <Grid item size={12}>
                <FormGroup>
                  <RequiredField title="From Account" boldTitle={true}/>
                  <FormControl variant="outlined" fullWidth>
                    <Autocomplete
                      size='small'
                      id="fromAccount"
                      name="fromAccount"
                      options={accounts}
                      getOptionLabel={(option) => option ? `${option.accountName} (${option.currency})` : ''}
                      value={values.fromAccount}
                      onChange={handleFromAccountChange}
                      onBlur={handleBlur}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={touched.fromAccount && Boolean(errors.fromAccount)}
                          helperText={touched.fromAccount && errors.fromAccount}
                        />
                      )}
                    />
                  </FormControl>
                  {/* Show balance if selected */}
                  {values.fromAccount && fromAccountBalance !== null && (
                    <Alert severity="info" sx={{ mt: 1, backgroundColor: '#F1F5F9', color: '#0F172A' }}>
                      <Typography variant="body2">
                        Balance: {fromAccountBalance} {values.fromAccount.currency || values.fromAccount.accountName}
                      </Typography>
                    </Alert>
                  )}
                </FormGroup>
              </Grid>

              {/* To Account Dropdown */}
              <Grid item size={12}>
                <FormGroup>
                  <RequiredField title="To Account" boldTitle={true}/>
                  <FormControl variant="outlined" fullWidth>
                    <Autocomplete
                      size='small'
                      id="toAccount"
                      name="toAccount"
                      options={accounts}
                      getOptionLabel={(option) => option ? `${option.accountName} (${option.currency})` : ''}
                      value={values.toAccount}
                      onChange={handleToAccountChange}
                      onBlur={handleBlur}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={touched.toAccount && Boolean(errors.toAccount)}
                          helperText={touched.toAccount && errors.toAccount}
                        />
                      )}
                    />
                  </FormControl>
                  {/* Show balance if selected */}
                  {values.toAccount && toAccountBalance !== null && (
                    <Alert severity="info" sx={{ mt: 1, backgroundColor: '#F1F5F9', color: '#0F172A' }}>
                      <Typography variant="body2">
                        Balance: {toAccountBalance} {values.toAccount.currency || values.toAccount.accountName}
                      </Typography>
                    </Alert>
                  )}
                </FormGroup>
              </Grid>

              {/* Amount Field */}
              <Grid item size={12}>
                <FormGroup>
                  <RequiredField title="Amount" boldTitle={true}/>
                  <TextField
                    size="small"
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.amount && Boolean(errors.amount)}
                    helperText={touched.amount && errors.amount}
                    fullWidth
                    inputProps={{ min: 0, step: 'any' }}
                  />
                </FormGroup>
              </Grid>

              {/* Converted Amount Display */}
              {values.amount && values.fromAccount && values.toAccount && (
                <Grid item xs={12}>
                  <Alert severity="success" sx={{ mt: 2, backgroundColor: '#F0FDF4', color: '#166534' }}>
                    <Typography variant="body2">
                      {values.amount} {values.fromAccount.currency} = {convertedAmount.toFixed(2)} {values.toAccount.currency}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
          <FormButtons 
            handleClose={handleClose} 
            handleClearForm={handleClearForm} 
            submitting={submitting} 
          />
        </Box>
      </form>
    </div>
  );
};

export default ExchangeForm;