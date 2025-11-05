import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Proveedores from './pages/Proveedores';
import ProveedorDetalle from './pages/ProveedorDetalle';
import ComprasNueva from './pages/ComprasNueva';
import PagoProveedorNuevo from './pages/PagoProveedorNuevo';
import Ventas from './pages/Ventas';
import Stock from './pages/Stock';
import Vencimientos from './pages/Vencimientos';
import Reportes from './pages/Reportes';
import Backup from './pages/Backup';
import Usuarios from './pages/Usuarios';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ventas" element={<Ventas />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/vencimientos" element={<Vencimientos />} />
                <Route
                  path="/productos"
                  element={
                    <ProtectedRoute requiredRole="DUENO">
                      <Productos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proveedores"
                  element={
                    <ProtectedRoute requiredRole="DUENO">
                      <Proveedores />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proveedores/:id"
                  element={
                    <ProtectedRoute requiredRole="DUENO">
                      <ProveedorDetalle />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/compras/nueva"
                  element={
                    <ProtectedRoute requiredRole="DUENO">
                      <ComprasNueva />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pagos/nuevo"
                  element={
                    <ProtectedRoute requiredRole="DUENO">
                      <PagoProveedorNuevo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reportes"
                  element={
                    <ProtectedRoute requiredRole="DUENO">
                      <Reportes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/backup"
                  element={
                    <ProtectedRoute requiredRole="DUENO">
                      <Backup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <ProtectedRoute requiredRole="DUENO">
                      <Usuarios />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

