import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import type { JSX } from 'react';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, role } = useAppSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
