import React, { useState, useEffect, useRef } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { VscSend } from "react-icons/vsc";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { PiBroomLight } from "react-icons/pi";
import { Button, Grid } from "@mui/material";
import { PiDotsThreeOutlineBold } from "react-icons/pi";

const FormButtons = ({ handleClose, handleClearForm, submitting, hideClose = false }) => {
  const [showButtons, setShowButtons] = useState(false);
  const buttonsRef = useRef(null);

  const handleToggleButtons = () => {
    setShowButtons(!showButtons);
  };

  const handleClickOutside = (event) => {
    if (buttonsRef.current && !buttonsRef.current.contains(event.target)) {
      setShowButtons(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={buttonsRef}>
      {!showButtons && (
        <Button
          sx={{
            color: 'black',
            marginTop: '10px',
            '&:hover': {
              fontWeight: 'bold',
              '& svg': {
                fontWeight: 'bold'
              }
            }
          }}
          startIcon={<PiDotsThreeOutlineBold style={{ marginBottom: '-2px' }} />}
          onClick={handleToggleButtons}
        >
        </Button>
      )}
      {showButtons && (
        <Grid container spacing={4} sx={{ pt: 2 }}>
          <Grid item xs={12} sm={12} sx={{
            display: "flex",
            justifyContent: "start"
          }}>
            <Button
              color="inherit"
              sx={{
                marginRight: '10px',
                backgroundColor: 'transparent',
                color: 'black',
                fontSize: '12px',
                border: '1px solid transparent',
                '&:hover': {
                  //fontWeight: 'bold',
                  borderBottom: "2px solid red",
                  '& svg': {
                    fontWeight: 'bold'
                  }
                }
              }}
              startIcon={<IoMdCloseCircleOutline style={{ marginBottom: '2px', color: 'red', fontSize: '16px' }} />}
              onClick={handleClose}
            >
              Close
            </Button>

            <Button
              color="inherit"
              sx={{
                marginRight: '10px',
                backgroundColor: 'transparent',
                color: 'black',
                fontSize: '12px',
                border: '1px solid transparent',
                '&:hover': {
                  //fontWeight: 'bold',
                  borderBottom: "2px solid gray",
                  '& svg': {
                    fontWeight: 'bold'
                  }
                }
              }}
              startIcon={<PiBroomLight style={{ marginBottom: '2px', color: 'gray', fontSize: '16px' }} />}
              onClick={handleClearForm}
            >
              Clear Form
            </Button>

            <LoadingButton
              type="submit"
              loading={submitting}
              sx={{ 
                backgroundColor: 'transparent', 
                color: 'black',
                fontSize: '12px',
                '&:hover': { 
                  //fontWeight: 'bold',
                  borderBottom: "2px solid blue",
                  '& svg': {
                    fontWeight: 'bold'
                  }
                } 
              }}
              endIcon={<VscSend style={{ marginBottom: '0px', color: 'blue', fontSize: '16px' }} />}
            >
              Submit
            </LoadingButton>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default FormButtons;