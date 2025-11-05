import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  AlertTriangle,
  Calendar,
  BarChart3,
  Database,
  UserCog,
  LogOut,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: 'DUENO' | 'EMPLEADO';
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Productos', path: '/productos', icon: Package, requiredRole: 'DUENO' },
  { name: 'Proveedores', path: '/proveedores', icon: Users, requiredRole: 'DUENO' },
  { name: 'Ventas', path: '/ventas', icon: ShoppingCart },
  { name: 'Stock', path: '/stock', icon: AlertTriangle },
  { name: 'Vencimientos', path: '/vencimientos', icon: Calendar },
  { name: 'Reportes', path: '/reportes', icon: BarChart3, requiredRole: 'DUENO' },
  { name: 'Backup', path: '/backup', icon: Database, requiredRole: 'DUENO' },
  { name: 'Usuarios', path: '/usuarios', icon: UserCog, requiredRole: 'DUENO' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout, isDueño } = useAuth();

  const filteredNavItems = navItems.filter(item => {
    if (!item.requiredRole) return true;
    return item.requiredRole === user?.rol || isDueño;
  });

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen flex flex-col">
      <nav className="p-4 space-y-2 flex-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Footer con información del usuario y logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}

