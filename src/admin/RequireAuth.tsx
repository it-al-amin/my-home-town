import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Route guard (UX only). The API enforces authentication and permissions on every request. */
export const RequireAuth: React.FC<{ children: React.ReactNode; permission?: string }> = ({ children, permission }) => {
  const { me, loading, can } = useAuth();
  const loc = useLocation();
  if (loading) return <p className="p-10 text-center text-slate-500">…</p>;
  if (!me) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (permission && !can(permission)) {
    return <p className="p-10 text-center text-slate-600 dark:text-slate-300">You do not have permission to view this page.</p>;
  }
  return <>{children}</>;
};
