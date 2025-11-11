import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SpinnerIcon } from './icons/SpinnerIcon';

const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <SpinnerIcon className="h-12 w-12 animate-spin text-brand-primary" />
      </div>
    );
  }

  return session ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
