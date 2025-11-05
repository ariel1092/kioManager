import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import type { LoginResponse } from '../types';

interface AuthContextType {
  user: LoginResponse['usuario'] | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isDueño: boolean;
  isEmpleado: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse['usuario'] | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Actualizar el token en el servicio API
      apiService.setToken(storedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    
    // Guardar en localStorage primero
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.usuario));
    
    // Actualizar el token en el servicio API
    apiService.setToken(response.token);
    
    // Actualizar el estado después de guardar en localStorage
    setUser(response.usuario);
    setToken(response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    apiService.setToken(null);
  };

  const isAuthenticated = !!user && !!token;
  const isDueño = user?.rol === 'DUENO';
  const isEmpleado = user?.rol === 'EMPLEADO';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isDueño,
        isEmpleado,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}

