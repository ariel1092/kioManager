import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Rol } from '../types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Rol;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}



