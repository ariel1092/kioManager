import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-8 w-8 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Sistema de Gestión de Kiosco
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600">
                {user.nombre} ({user.rol})
              </span>
            )}
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('es-AR')}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

