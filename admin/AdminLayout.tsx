
import React, { useState, useEffect } from 'react';
import * as RouterDOM from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './admin.css';

// Fix missing Outlet in react-router-dom
const { Outlet, useLocation } = RouterDOM as any;

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="admin-mode">
      <div className="admin-container relative flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={isSidebarOpen} />

        <main className="admin-main">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="admin-content animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
