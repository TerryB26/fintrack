import React, { useState } from 'react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/' },
    { name: 'Transactions', icon: '💳', path: '/transactions' },
    { name: 'Budgets', icon: '💰', path: '/budgets' },
    { name: 'Categories', icon: '📂', path: '/categories' },
    { name: 'Reports', icon: '📈', path: '/reports' },
    { name: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <div className={`bg-white shadow-lg h-screen transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-800">FinTrack</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="mt-4">
        <ul className="space-y-2 px-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.path}
                className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
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
        <div className="flex items-center p-3 text-gray-700">
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