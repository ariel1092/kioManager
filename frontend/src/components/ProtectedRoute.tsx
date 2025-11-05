import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Rol } from '../types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Rol;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  // Verificar localStorage en caso de que el contexto no se haya actualizado aún
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    // Si hay token en localStorage pero el contexto no está autenticado, esperar un momento
    if (token && storedUser && !isAuthenticated) {
      // Esperar un momento para que el contexto se actualice
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 100);
      return () => clearTimeout(timer);
    }
    
    setIsChecking(false);
  }, [isAuthenticated]);

  // Mostrar loading mientras se verifica
  if (isChecking) {
    return null; // O un componente de loading
  }

  // Verificar autenticación: primero el contexto, luego localStorage
  const token = localStorage.getItem('token');
  const hasAuth = isAuthenticated || !!token;

  if (!hasAuth) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}




