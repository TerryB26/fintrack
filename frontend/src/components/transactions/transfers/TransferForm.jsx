/* eslint-disable no-unused-vars */
import { MenuItem, TextField, Box, Button, FormControl, FormGroup, Grid, Autocomplete, Alert, CircularProgress, Typography, InputAdornment } from "@mui/material";
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import * as yup from 'yup';
import FormButtons from'../../general/FormButtons';
import RequiredField from'../../general/RequiredField';
import Swal from 'sweetalert2';
import { transactionsAPI, accountsAPI, usersAPI } from '../../../services/api';

const TransferForm = ({ handleClose, user, refreshData }) => {

  const [fromAccounts, setFromAccounts] = useState([]);
  const [loadingFromAccounts, setLoadingFromAccounts] = useState(true);
  const [fromAccountError, setFromAccountError] = useState("");
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [recipientAccounts, setRecipientAccounts] = useState([]);
  const [loadingRecipientAccounts, setLoadingRecipientAccounts] = useState(false);
  const [recipientInputValue, setRecipientInputValue] = useState('');
    const [submitting, setSubmitting] = useState(false);
  const [amountError, setAmountError] = useState("");

  const validationObj = {
    fromAccount: yup.object().nullable().required("Source Account Required"),
    recipient: yup.object().nullable().required("Recipient Required"),
    recipientAccount: yup.object().nullable().required("Recipient Account Required"),
    amount: yup.number().typeError("Please enter a valid number").positive("Amount must be positive").required("* Required"),
  };
  const validationSchema = yup.object(validationObj);

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, setFieldValue, resetForm } = useFormik({
    initialValues: {
      fromAccount: null,
      recipient: null,
      recipientAccount: null,
      amount: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const transferAmount = parseFloat(values.amount);
        if (isNaN(transferAmount) || !isFinite(transferAmount) || transferAmount <= 0) {
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

        // Check if transferring to the same account
        if (values.fromAccount.id === values.recipientAccount.id) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Transfer',
            text: 'You cannot transfer money to the same account.',
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'OK'
          });
          setSubmitting(false);
          return;
        }

        // Check if sufficient balance
        if (parseFloat(values.fromAccount.balance) < transferAmount) {
          Swal.fire({
            icon: 'error',
            title: 'Insufficient Balance',
            text: `Your account balance (${values.fromAccount.balance} ${values.fromAccount.currency}) is not enough for this transfer.`,
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'OK'
          });
          setSubmitting(false);
          return;
        }

        const transferData = {
          fromAccountId: values.fromAccount.id,
          toAccountId: values.recipientAccount.id,
          amount: transferAmount,
          description: `Transfer to ${values.recipient.fullName || values.recipient.username}`
        };

        await transactionsAPI.transfer(
          transferData.fromAccountId,
          transferData.toAccountId,
          transferData.amount,
          transferData.description
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Transfer Successful!',
          html: `
            <p>Successfully transferred:</p>
            <p><strong>${values.amount} ${values.fromAccount.currency}</strong></p>
            <p>to ${values.recipient.fullName || values.recipient.username}</p>
            <p>Account: ${values.recipientAccount.accountName}</p>
          `,
          confirmButtonColor: '#00B4D8',
          confirmButtonText: 'OK'
        });

        if (refreshData) refreshData();
        handleClearForm();
        handleClose();
      } catch (error) {
        console.error('Transfer error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Transfer Failed',
          text: error.response?.data?.message || error.message || 'An error occurred while processing your transfer. Please try again.',
          confirmButtonColor: '#EF4444',
          confirmButtonText: 'OK'
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    const fetchFromAccounts = async () => {
      try {
        if (!user || !user.id) {
          setFromAccounts([]);
          setLoadingFromAccounts(false);
          setFromAccountError("No user found. Please log in.");
          return;
        }
        const arr = await accountsAPI.getAccounts();
        console.log("🚀 ~ fetchFromAccounts ~ arr:", arr)
        const unlocked = Array.isArray(arr) ? arr.filter(acc => !acc.isLocked) : [];
        console.log("🚀 ~ fetchFromAccounts ~ unlocked:", unlocked)
        setFromAccounts(unlocked);
        if (!unlocked || unlocked.length === 0) {
          setFromAccountError("No unlocked accounts found for this user.");
        } else {
          setFromAccountError("");
        }
      } catch (err) {
        setFromAccountError("Failed to load accounts");
        setFromAccounts([]);
      } finally {
        setLoadingFromAccounts(false);
      }
    };
    fetchFromAccounts();
  }, [user]);

  useEffect(() => {
    const loadInitialUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await usersAPI.searchUsers('');
        const filteredUsers = (res.data || []).filter(u => u.id !== user?.id);
        setAllUsers(filteredUsers);
        setUsers(filteredUsers);
        setUsersLoaded(true);
      } catch (err) {
        console.error('Error loading users:', err);
        setAllUsers([]);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadInitialUsers();
  }, [user]); 

  useEffect(() => {
    if (usersLoaded) {
      if (recipientInputValue.trim()) {
        const filtered = allUsers.filter(user => 
          user.fullName?.toLowerCase().includes(recipientInputValue.toLowerCase()) ||
          user.username?.toLowerCase().includes(recipientInputValue.toLowerCase()) ||
          user.email?.toLowerCase().includes(recipientInputValue.toLowerCase())
        );
        setUsers(filtered);
      } else {
        setUsers(allUsers);
      }
    }
  }, [recipientInputValue, allUsers, usersLoaded]);

  useEffect(() => {
    const fetchRecipientAccounts = async () => {
      if (values.recipient && values.recipient.id) {
        setLoadingRecipientAccounts(true);
        try {
          const res = await usersAPI.getUserAccounts(values.recipient.id);
          setRecipientAccounts(res.data || []);
        } catch (err) {
          setRecipientAccounts([]);
        } finally {
          setLoadingRecipientAccounts(false);
        }
      } else {
        setRecipientAccounts([]);
      }
    };
    fetchRecipientAccounts();
  }, [values.recipient]);

  useEffect(() => {
    if (values.amount && values.fromAccount) {
      const amount = parseFloat(values.amount);
      const balance = parseFloat(values.fromAccount.balance);
      if (!isNaN(amount) && amount > balance) {
        setAmountError(`Amount exceeds available balance of ${balance} ${values.fromAccount.currency}`);
      } else {
        setAmountError("");
      }
    } else {
      setAmountError("");
    }
  }, [values.amount, values.fromAccount]);

  const handleRecipientChange = (event, newValue) => {
    setFieldValue('recipient', newValue);
    setFieldValue('recipientAccount', null);
    setRecipientInputValue('');
  };

  const handleRecipientAccountChange = (event, newValue) => {
    setFieldValue('recipientAccount', newValue);
  };

  const handleFromAccountChange = (event, newValue) => {
    setFieldValue('fromAccount', newValue);
  };

  const handleClearForm = () => {
    resetForm();
    setUsers(allUsers);
    setRecipientAccounts([]);
    setRecipientInputValue('');
    setAmountError('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box sx={{ flexGrow: 1 }} >
          <Grid container spacing={2} sx={{ p: 0 }}>
            
            <Grid item size={8}>
              <FormGroup>
                <RequiredField title="From Account" boldTitle={true}/>
                <FormControl variant="outlined" fullWidth>
                  <Autocomplete
                    size='small'
                    id="fromAccount"
                    name="fromAccount"
                    options={fromAccounts}
                    getOptionLabel={(option) => `${option.accountName} (${option.currency})`}
                    value={values.fromAccount}
                    onChange={handleFromAccountChange}
                    onBlur={handleBlur}
                    loading={loadingFromAccounts}
                    disabled={loadingFromAccounts}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={touched.fromAccount && Boolean(errors.fromAccount)}
                        helperText={touched.fromAccount && errors.fromAccount}
                      />
                    )}
                  />
                </FormControl>
                {values.fromAccount && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Available Balance: {values.fromAccount.balance} {values.fromAccount.currency}
                  </Typography>
                )}
                {fromAccountError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {fromAccountError}
                  </Alert>
                )}
              </FormGroup>
            </Grid>

            <Grid item size={8}>
              <FormGroup>
                <RequiredField title="Recipient" boldTitle={true}/>
                <FormControl variant="outlined" fullWidth>
                  <Autocomplete
                    size='small'
                    id="recipient"
                    name="recipient"
                    options={users}
                    getOptionLabel={(option) => option.fullName || option.username}
                    value={values.recipient}
                    inputValue={recipientInputValue}
                    onInputChange={(event, newInputValue) => {
                      setRecipientInputValue(newInputValue);
                    }}
                    onChange={handleRecipientChange}
                    onBlur={handleBlur}
                    loading={loadingUsers}
                    openOnFocus={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search for recipient..."
                        error={touched.recipient && Boolean(errors.recipient)}
                        helperText={touched.recipient && errors.recipient}
                      />
                    )}
                  />
                </FormControl>
              </FormGroup>
            </Grid>

            {values.recipient && (
              <Grid item size={8}>
                <FormGroup>
                  <RequiredField title="Recipient Account" boldTitle={true}/>
                  <FormControl variant="outlined" fullWidth>
                    <Autocomplete
                      size='small'
                      id="recipientAccount"
                      name="recipientAccount"
                      options={recipientAccounts}
                      getOptionLabel={(option) => `${option.accountName} (${option.currency})`}
                      value={values.recipientAccount}
                      onChange={handleRecipientAccountChange}
                      onBlur={handleBlur}
                      loading={loadingRecipientAccounts}
                      disabled={loadingRecipientAccounts}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={touched.recipientAccount && Boolean(errors.recipientAccount)}
                          helperText={touched.recipientAccount && errors.recipientAccount}
                        />
                      )}
                    />
                  </FormControl>
                </FormGroup>
              </Grid>
            )}

            <Grid item size={8}>
              <FormGroup>
                <RequiredField title="Amount" boldTitle={true}/>
                <FormControl variant="outlined" fullWidth>
                  <TextField 
                    size='small'
                    id="amount"
                    name="amount"
                    type="number"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.amount && Boolean(errors.amount)}
                    helperText={touched.amount && errors.amount}
                    inputProps={{ step: "0.01", min: "0" }}
                    InputProps={{
                      startAdornment: values.fromAccount ? <InputAdornment position="start">{values.fromAccount.currency}</InputAdornment> : null,
                    }}
                  />
                </FormControl>
                {amountError && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    {amountError}
                  </Alert>
                )}
              </FormGroup>
            </Grid>

          </Grid>

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

export default TransferForm;