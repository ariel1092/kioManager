import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';
import type {
  Producto,
  Proveedor,
  Venta,
  Lote,
  GananciasReporte,
  CrearProductoDTO,
  CrearProveedorDTO,
  CrearVentaDTO,
  ApiResponse,
  ApiError,
} from '../types';

  /**
   * Cliente HTTP para comunicación con la API
   * Patrón Singleton para instancia única
   */
class ApiService {
  private client: AxiosInstance | null = null;

  constructor() {
    this.ensureClientInitialized();
  }

  /**
   * Asegura que el cliente HTTP esté inicializado
   */
  private ensureClientInitialized(): void {
    if (this.client) {
      return;
    }

    // Validar que API_BASE_URL esté definido
    const baseURL = API_BASE_URL || 'http://localhost:3010/api';
    
    if (!API_BASE_URL) {
      console.warn('API_BASE_URL no está definido. Usando URL por defecto:', baseURL);
    }

    try {
      this.client = axios.create({
        baseURL,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Interceptor para manejo de errores
      this.client.interceptors.response.use(
        (response) => response,
        (error: AxiosError<ApiError>) => {
          if (error.response) {
            const apiError = error.response.data;
            throw new Error(apiError.error || 'Error desconocido');
          }
          throw new Error('Error de conexión con el servidor');
        }
      );

      // Aplicar token si existe
      const token = localStorage.getItem('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      console.log('ApiService inicializado con baseURL:', baseURL);
    } catch (error) {
      console.error('Error al inicializar ApiService:', error);
      throw error;
    }
  }

  // ============================================
  // PRODUCTOS
  // ============================================
  async crearProducto(data: CrearProductoDTO): Promise<Producto> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.post<ApiResponse<Producto>>('/productos', data);
    return response.data.data;
  }

  async listarProductos(activos?: boolean): Promise<Producto[]> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const params = activos !== undefined ? { activos: activos.toString() } : {};
    const response = await this.client.get<ApiResponse<Producto[]>>('/productos', { params });
    return response.data.data;
  }

  async obtenerProductosStockBajo(): Promise<Producto[]> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get<ApiResponse<Producto[]>>('/productos/stock-bajo');
    return response.data.data;
  }

  async buscarProductoPorCodigo(codigo: string): Promise<Producto> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get<ApiResponse<Producto>>(`/productos/codigo/${encodeURIComponent(codigo)}`);
    return response.data.data;
  }

  // ============================================
  // PROVEEDORES
  // ============================================
  async crearProveedor(data: CrearProveedorDTO): Promise<Proveedor> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.post<ApiResponse<Proveedor>>('/proveedores', data);
    return response.data.data;
  }

  async listarProveedores(activos?: boolean): Promise<Proveedor[]> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const params = activos !== undefined ? { activos: activos.toString() } : {};
    const response = await this.client.get<ApiResponse<Proveedor[]>>('/proveedores', { params });
    return response.data.data;
  }

  // ============================================
  // VENTAS
  // ============================================
  registrarVenta = async (data: CrearVentaDTO): Promise<Venta> => {
    // Asegurar que el cliente esté inicializado
    this.ensureClientInitialized();
    
    if (!this.client) {
      throw new Error('No se pudo inicializar el cliente HTTP');
    }

    // Asegurar que el token esté configurado
    const token = localStorage.getItem('token');
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await this.client.post<ApiResponse<Venta>>('/ventas', data);
      return response.data.data;
    } catch (error) {
      console.error('Error en registrarVenta:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al registrar venta');
    }
  }

  async listarVentas(fechaInicio?: Date, fechaFin?: Date): Promise<Venta[]> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const params: Record<string, string> = {};
    if (fechaInicio) params.fechaInicio = fechaInicio.toISOString();
    if (fechaFin) params.fechaFin = fechaFin.toISOString();
    
    const response = await this.client.get<ApiResponse<Venta[]>>('/ventas', { params });
    return response.data.data;
  }

  // ============================================
  // LOTES
  // ============================================
  async obtenerLotesVencidos(): Promise<Lote[]> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get<ApiResponse<Lote[]>>('/lotes/vencidos');
    return response.data.data;
  }

  async obtenerLotesPorVencer(dias: number = 30): Promise<Lote[]> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get<ApiResponse<Lote[]>>('/lotes/por-vencer', {
      params: { dias },
    });
    return response.data.data;
  }

  async obtenerLotesPorProducto(productoId: string): Promise<Lote[]> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get<ApiResponse<Lote[]>>(`/lotes/producto/${productoId}`);
    return response.data.data;
  }

  // ============================================
  // REPORTES
  // ============================================
  async obtenerGanancias(fechaInicio: Date, fechaFin: Date): Promise<GananciasReporte> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get<ApiResponse<GananciasReporte>>('/reportes/ganancias', {
      params: {
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0],
      },
    });
    return response.data.data;
  }

  async obtenerVentasPorFecha(fechaInicio: Date, fechaFin: Date): Promise<Array<{
    fecha: string;
    cantidad: number;
    total: number;
    ganancia: number;
  }>> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get<ApiResponse<Array<{
      fecha: string;
      cantidad: number;
      total: number;
      ganancia: number;
    }>>>('/reportes/ventas-por-fecha', {
      params: {
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0],
      },
    });
    return response.data.data;
  }

  async obtenerProductosMasVendidos(fechaInicio: Date, fechaFin: Date, limite: number = 10): Promise<Array<{
    productoId: string;
    productoNombre: string;
    cantidadVendida: number;
    totalVentas: number;
    ganancia: number;
  }>> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get<ApiResponse<Array<{
      productoId: string;
      productoNombre: string;
      cantidadVendida: number;
      totalVentas: number;
      ganancia: number;
    }>>>('/reportes/productos-mas-vendidos', {
      params: {
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0],
        limite,
      },
    });
    return response.data.data;
  }

  // ============================================
  // PROVEEDORES (extra)
  // ============================================
  async obtenerProductosDeProveedor(proveedorId: string) {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get(`/proveedores/${proveedorId}/productos`);
    return response.data.data;
  }

  async obtenerDeudaProveedor(proveedorId: string) {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get(`/proveedores/${proveedorId}/deuda`);
    return response.data.data as { deudaTotal: number; comprasPendientes: number; comprasVencidas: number };
  }

  // ============================================
  // COMPRAS
  // ============================================
  async registrarCompra(data: {
    proveedorId: string;
    numeroFactura?: string | null;
    fechaCompra?: Date;
    items: Array<{ productoId: string; cantidad: number; precioUnitario: number }>;
    formaPago?: 'contado' | 'credito' | 'transferencia';
    fechaVencimiento?: Date | null;
    notas?: string | null;
  }) {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const payload = {
      ...data,
      fechaCompra: data.fechaCompra ? data.fechaCompra.toISOString() : undefined,
      fechaVencimiento: data.fechaVencimiento ? data.fechaVencimiento.toISOString() : undefined,
    };
    const response = await this.client.post('/compras', payload);
    return response.data.data;
  }

  async listarCompras(params?: { proveedorId?: string; soloPendientes?: boolean; soloVencidas?: boolean }) {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get('/compras', { params });
    return response.data.data;
  }

  // ============================================
  // PAGOS A PROVEEDORES
  // ============================================
  async registrarPagoProveedor(data: {
    proveedorId: string;
    compraId?: string | null;
    fecha?: Date;
    monto: number;
    metodoPago?: 'efectivo' | 'transferencia' | 'cheque' | 'tarjeta';
    observaciones?: string | null;
  }) {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const payload = {
      ...data,
      fecha: data.fecha ? data.fecha.toISOString() : undefined,
    };
    const response = await this.client.post('/pagos-proveedor', payload);
    return response.data.data;
  }

  // ============================================
  // AUTHENTICATION
  // ============================================
  async login(email: string, password: string): Promise<LoginResponse> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    });
    return response.data.data;
  }

  async registrarUsuario(data: {
    nombre: string;
    email: string;
    password: string;
    rol?: string;
  }): Promise<any> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.post<ApiResponse<any>>('/auth/registrar', data);
    return response.data.data;
  }

  // ============================================
  // USUARIOS
  // ============================================
  async listarUsuarios(activos?: boolean): Promise<Usuario[]> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const params = activos !== undefined ? { activos: activos.toString() } : {};
    const response = await this.client.get<ApiResponse<Usuario[]>>('/usuarios', { params });
    return response.data.data;
  }

  async obtenerUsuario(id: string): Promise<Usuario> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get<ApiResponse<Usuario>>(`/usuarios/${id}`);
    return response.data.data;
  }

  async crearUsuario(data: {
    nombre: string;
    email: string;
    password: string;
    rol?: 'DUENO' | 'EMPLEADO';
  }): Promise<Usuario> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.post<ApiResponse<Usuario>>('/usuarios', data);
    return response.data.data;
  }

  async actualizarUsuario(id: string, data: {
    nombre?: string;
    email?: string;
    rol?: 'DUENO' | 'EMPLEADO';
    activo?: boolean;
  }): Promise<Usuario> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.put<ApiResponse<Usuario>>(`/usuarios/${id}`, data);
    return response.data.data;
  }

  async eliminarUsuario(id: string): Promise<void> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    await this.client.delete(`/usuarios/${id}`);
  }

  async cambiarContrasena(id: string, data: {
    nuevaPassword: string;
    passwordActual?: string;
  }): Promise<void> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    await this.client.put(`/usuarios/${id}/contrasena`, data);
  }

  // ============================================
  // BACKUP Y EXPORTACIÓN
  // ============================================
  async exportarDatos(): Promise<Blob> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get('/backup/exportar', {
      responseType: 'blob',
    });
    return response.data;
  }

  // ============================================
  // HEALTH CHECK
  // ============================================
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    const response = await this.client.get('/health');
    return response.data;
  }

  /**
   * Establece el token de autenticación
   */
  setToken(token: string | null): void {
    this.ensureClientInitialized();
    if (!this.client) throw new Error('Cliente HTTP no inicializado');
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }
}

export const apiService = new ApiService();

