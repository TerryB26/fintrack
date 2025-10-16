/* eslint-disable no-unused-vars */
import { MenuItem, TextField, Box, Button, FormControl, FormGroup, Grid, Autocomplete } from "@mui/material";
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import * as yup from 'yup';
import FormButtons from'../../general/FormButtons';
import RequiredField from'../../general/RequiredField';

const ExchangeForm = ({ handleClose }) => {

  const users = [
    { id: 1, name: 'John Doe', accountNumber: '1234567890' },
    { id: 2, name: 'Jane Smith', accountNumber: '0987654321' },
    { id: 3, name: 'Mike Johnson', accountNumber: '5555555555' }
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' }
  ];

  const validationObj = {
    recipient: yup.object().nullable().required("A Recipient Is Required"),
    accountNumber: yup.string().required("An Account Number Required"),
    amount: yup.number().typeError("Please enter a valid number").positive("Amount must be positive").required("* Required"),
    currency: yup.object().nullable().required("Currency Required"),
  };

  const validationSchema = yup.object(validationObj);

  const [submitting, setSubmitting] = useState(false);
  const [accountNumberDisabled, setAccountNumberDisabled] = useState(false);

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, setFieldValue, resetForm } = useFormik({
    initialValues: {
      recipient: null,
      accountNumber: "",
      amount: "",
      currency: null,
    },
    validationSchema: validationSchema,
    
  });

  const handleRecipientChange = (event, newValue) => {
    setFieldValue('recipient', newValue);
    if (newValue) {
      setFieldValue('accountNumber', newValue.accountNumber);
      setAccountNumberDisabled(true);
    } else {
      setAccountNumberDisabled(false);
    }
  };

  const handleAccountNumberChange = (e) => {
    const inputAccountNumber = e.target.value;
    setFieldValue('accountNumber', inputAccountNumber);
    
    const matchedUser = users.find(user => user.accountNumber === inputAccountNumber);
    if (matchedUser && !values.recipient) {
      setFieldValue('recipient', matchedUser);
      setAccountNumberDisabled(true);
    }
  };

  const handleCurrencyChange = (event, newValue) => {
    setFieldValue('currency', newValue);
  };

  const handleClearForm = () => {
    resetForm();
    setAccountNumberDisabled(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box sx={{ flexGrow: 1 }} >
          <Grid container spacing={2} sx={{ p: 0 }}>
            
            {/* Recipient Dropdown */}
            <Grid item size={8}>
              <FormGroup>
                <RequiredField title="Recipient" boldTitle={true}/>
                <FormControl variant="outlined" fullWidth>
                  <Autocomplete
                    size='small'
                    id="recipient"
                    name="recipient"
                    options={users}
                    getOptionLabel={(option) => option.name}
                    value={values.recipient}
                    onChange={handleRecipientChange}
                    onBlur={handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={touched.recipient && Boolean(errors.recipient)}
                        helperText={touched.recipient && errors.recipient}
                      />
                    )}
                  />
                </FormControl>
              </FormGroup>
            </Grid>

            {/* Account Number Field */}
            <Grid item size={8}>
              <FormGroup>
                <RequiredField title="Account Number" boldTitle={true}/>
                <FormControl variant="outlined" fullWidth>
                  <TextField 
                    size='small'
                    id="accountNumber"
                    name="accountNumber"
                    value={values.accountNumber}
                    onChange={handleAccountNumberChange}
                    onBlur={handleBlur}
                    disabled={accountNumberDisabled}
                    error={touched.accountNumber && Boolean(errors.accountNumber)}
                    helperText={touched.accountNumber && errors.accountNumber}
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        backgroundColor: '#F5F5F5',
                        WebkitTextFillColor: '#666'
                      }
                    }}
                  />
                </FormControl>
              </FormGroup>
            </Grid>

            {/* Amount Field */}
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
                  />
                </FormControl>
              </FormGroup>
            </Grid>

            {/* Currency Dropdown */}
            <Grid item size={4}>
              <FormGroup>
                <RequiredField title="Currency" boldTitle={true}/>
                <FormControl variant="outlined" fullWidth>
                  <Autocomplete
                    size='small'
                    id="currency"
                    name="currency"
                    options={currencies}
                    getOptionLabel={(option) => `${option.code} - ${option.name} (${option.symbol})`}
                    value={values.currency}
                    onChange={handleCurrencyChange}
                    onBlur={handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={touched.currency && Boolean(errors.currency)}
                        helperText={touched.currency && errors.currency}
                      />
                    )}
                  />
                </FormControl>
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

export default ExchangeForm;