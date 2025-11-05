/**
 * Configuración de la API
 */
const envApiUrl = import.meta.env.VITE_API_URL;
// Usar el puerto 3010 como default (donde está corriendo el backend según los logs)
export const API_BASE_URL = envApiUrl || 'http://localhost:3010/api';

// Validar que la URL esté definida
if (!API_BASE_URL) {
  console.warn('API_BASE_URL no está definido. Usando URL por defecto.');
}

console.log('API_BASE_URL configurado:', API_BASE_URL);

export const API_ENDPOINTS = {
  // Health
  health: '/health',
  
  // Productos
  productos: '/productos',
  productosStockBajo: '/productos/stock-bajo',
  
  // Proveedores
  proveedores: '/proveedores',
  
  // Ventas
  ventas: '/ventas',
  
  // Lotes
  lotesVencidos: '/lotes/vencidos',
  lotesPorVencer: '/lotes/por-vencer',
  
  // Reportes
  reportesGanancias: '/reportes/ganancias',
} as const;

