import React from 'react';
import Sidebar from './sidebar';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { MdLogout } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="shadow-sm border-b border-gray-200 px-4 py-3" style={{ backgroundColor: '#0d1b2a' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Logout">
                  <IconButton onClick={handleLogout} sx={{ color: 'white' }}>
                    <MdLogout size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;