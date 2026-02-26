
import React from 'react';
import * as RouterDOM from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './admin.css';

// Fix missing Outlet in react-router-dom
const { Outlet } = RouterDOM as any;

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-mode">
      <div className="admin-container">
        <Sidebar aria-label="Main navigation" />
        <main className="admin-main">
          <Header />
          <div className="admin-content animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
