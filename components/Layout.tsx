
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Chatbot from './Chatbot';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-background font-sans">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default Layout;