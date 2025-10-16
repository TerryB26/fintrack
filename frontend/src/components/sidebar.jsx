import React, { useState } from 'react';
import { CiCircleChevRight } from "react-icons/ci";
import { CiCircleChevLeft } from "react-icons/ci";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/' },
    { name: 'Transactions', icon: '💳', path: '/transactions' },
  ];

  return (
    <div className={`shadow-lg h-screen transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`} style={{ backgroundColor: '#0d1b2a' }}>
      <div className="flex items-center justify-between p-4 ">
        {!isCollapsed && (
          <h1 className="text-xl font-bold" style={{ color: '#E0E1DD' }}>FinTrack</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg transition-colors duration-200"
          style={{ 
            color: '#E0E1DD',
            ':hover': { backgroundColor: '#1B263B' }
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1B263B'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          {isCollapsed ? <CiCircleChevRight size={20} /> : <CiCircleChevLeft size={20} />}
        </button>
      </div>

      <nav className="mt-4">
        <ul className="space-y-2 px-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.path}
                className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                style={{ color: '#E0E1DD' }}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className="flex items-center p-3"
        style={{ color: '#E0E1DD' }}>
          <div className=" flex items-center justify-center">
            👤
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;