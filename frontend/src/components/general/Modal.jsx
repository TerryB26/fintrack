/* eslint-disable no-unused-vars */
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import { MdClose } from 'react-icons/md';

const Modal = ({ open, onClose, title, children }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          borderBottom: '4px solid #3980e9'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#F0F9FF',
          fontWeight: 'bold',
          color: '#0F172A'
        }}
      >
        {title}
        <IconButton 
          onClick={onClose}
          sx={{ 
            color: '#415A77',
            '&:hover': {
              color: '#00B4D8',
              backgroundColor: 'rgba(0, 180, 216, 0.1)'
            }
          }}
        >
          <MdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {children}
      </DialogContent>
      {/* <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#00B4D8',
            '&:hover': {
              backgroundColor: '#0096B8'
            }
          }}
        >
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default Modal;