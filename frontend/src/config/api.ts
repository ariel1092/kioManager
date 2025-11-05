/**
 * Configuración de la API
 */
const envApiUrl = import.meta.env.VITE_API_URL;
// Normalizar la URL: asegurar que termine en /api
let apiUrl = envApiUrl || 'http://localhost:3010/api';
if (apiUrl && !apiUrl.endsWith('/api')) {
  // Si la URL no termina en /api, agregarlo
  apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api` : `${apiUrl}/api`;
}
export const API_BASE_URL = apiUrl;

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

