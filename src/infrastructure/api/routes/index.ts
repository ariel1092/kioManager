import { Router } from 'express';
import { ProductoRepository } from '../../repositories/ProductoRepository';
import { ProveedorRepository } from '../../repositories/ProveedorRepository';
import { LoteRepository } from '../../repositories/LoteRepository';
import { VentaRepository } from '../../repositories/VentaRepository';
import { UsuarioRepository } from '../../repositories/UsuarioRepository';
import { CompraRepository } from '../../repositories/CompraRepository';
import { PagoProveedorRepository } from '../../repositories/PagoProveedorRepository';
import { authenticate, authorize } from '../../middleware/auth';
import { authRateLimiter, strictRateLimiter } from '../../middleware/rateLimiter';
import { Rol } from '../../../domain/entities/Usuario';

// Use Cases
import { CrearProducto } from '../../../application/use-cases/productos/CrearProducto';
import { ListarProductos } from '../../../application/use-cases/productos/ListarProductos';
import { ObtenerProductosStockBajo } from '../../../application/use-cases/productos/ObtenerProductosStockBajo';
import { BuscarProductoPorCodigo } from '../../../application/use-cases/productos/BuscarProductoPorCodigo';
import { CrearProveedor } from '../../../application/use-cases/proveedores/CrearProveedor';
import { ListarProveedores } from '../../../application/use-cases/proveedores/ListarProveedores';
import { RegistrarVenta } from '../../../application/use-cases/ventas/RegistrarVenta';
import { ListarVentas } from '../../../application/use-cases/ventas/ListarVentas';
import { ObtenerLotesVencidos } from '../../../application/use-cases/lotes/ObtenerLotesVencidos';
import { ObtenerLotesPorVencer } from '../../../application/use-cases/lotes/ObtenerLotesPorVencer';
import { ObtenerLotesPorProducto } from '../../../application/use-cases/lotes/ObtenerLotesPorProducto';
import { ObtenerGanancias } from '../../../application/use-cases/reportes/ObtenerGanancias';
import { ObtenerVentasPorFecha } from '../../../application/use-cases/reportes/ObtenerVentasPorFecha';
import { ObtenerProductosMasVendidos } from '../../../application/use-cases/reportes/ObtenerProductosMasVendidos';
import { RegistrarCompra } from '../../../application/use-cases/compras/RegistrarCompra';
import { ListarCompras } from '../../../application/use-cases/compras/ListarCompras';
import { RegistrarPago } from '../../../application/use-cases/pagos/RegistrarPago';
import { ObtenerProductosPorProveedor } from '../../../application/use-cases/proveedores/ObtenerProductosPorProveedor';
import { ObtenerDeudaProveedor } from '../../../application/use-cases/proveedores/ObtenerDeudaProveedor';
import { ExportarDatos } from '../../../application/use-cases/backup/ExportarDatos';
import { Login } from '../../../application/use-cases/auth/Login';
import { RegistrarUsuario } from '../../../application/use-cases/auth/RegistrarUsuario';
import { ListarUsuarios } from '../../../application/use-cases/usuarios/ListarUsuarios';
import { ObtenerUsuario } from '../../../application/use-cases/usuarios/ObtenerUsuario';
import { ActualizarUsuario } from '../../../application/use-cases/usuarios/ActualizarUsuario';
import { EliminarUsuario } from '../../../application/use-cases/usuarios/EliminarUsuario';
import { CambiarContrasena } from '../../../application/use-cases/usuarios/CambiarContrasena';

// Controllers
import { ProductoController } from '../controllers/ProductoController';
import { ProveedorController } from '../controllers/ProveedorController';
import { VentaController } from '../controllers/VentaController';
import { LoteController } from '../controllers/LoteController';
import { ReporteController } from '../controllers/ReporteController';
import { CompraController } from '../controllers/CompraController';
import { PagoProveedorController } from '../controllers/PagoProveedorController';
import { BackupController } from '../controllers/BackupController';
import { UsuarioController } from '../controllers/UsuarioController';
import { AuthController } from '../controllers/AuthController';

/**
 * Configuración de rutas de la API
 * Dependency Injection de repositorios y casos de uso
 */
const router = Router();

// Inicializar repositorios
const productoRepository = new ProductoRepository();
const proveedorRepository = new ProveedorRepository();
const loteRepository = new LoteRepository();
const ventaRepository = new VentaRepository();
const usuarioRepository = new UsuarioRepository();
const compraRepository = new CompraRepository();
const pagoProveedorRepository = new PagoProveedorRepository();

// Inicializar casos de uso
const crearProducto = new CrearProducto(productoRepository);
const listarProductos = new ListarProductos(productoRepository);
const obtenerProductosStockBajo = new ObtenerProductosStockBajo(productoRepository);
const buscarProductoPorCodigo = new BuscarProductoPorCodigo(productoRepository);
const crearProveedor = new CrearProveedor(proveedorRepository);
const listarProveedores = new ListarProveedores(proveedorRepository);
const registrarVenta = new RegistrarVenta(ventaRepository, productoRepository, loteRepository);
const listarVentas = new ListarVentas(ventaRepository);
const obtenerLotesVencidos = new ObtenerLotesVencidos(loteRepository);
const obtenerLotesPorVencer = new ObtenerLotesPorVencer(loteRepository);
const obtenerLotesPorProducto = new ObtenerLotesPorProducto(loteRepository);
const obtenerGanancias = new ObtenerGanancias(ventaRepository, pagoProveedorRepository);
const obtenerVentasPorFecha = new ObtenerVentasPorFecha(ventaRepository);
const obtenerProductosMasVendidos = new ObtenerProductosMasVendidos(ventaRepository);
const registrarCompra = new RegistrarCompra(compraRepository, productoRepository, loteRepository);
const listarCompras = new ListarCompras(compraRepository);
const registrarPago = new RegistrarPago(pagoProveedorRepository, compraRepository);
const obtenerProductosPorProveedor = new ObtenerProductosPorProveedor(productoRepository);
const obtenerDeudaProveedor = new ObtenerDeudaProveedor(compraRepository);
const exportarDatos = new ExportarDatos();

// Inicializar casos de uso de autenticación
const login = new Login(usuarioRepository);
const registrarUsuario = new RegistrarUsuario(usuarioRepository);

// Inicializar casos de uso de usuarios
const listarUsuarios = new ListarUsuarios(usuarioRepository);
const obtenerUsuario = new ObtenerUsuario(usuarioRepository);
const actualizarUsuario = new ActualizarUsuario(usuarioRepository);
const eliminarUsuario = new EliminarUsuario(usuarioRepository);
const cambiarContrasena = new CambiarContrasena(usuarioRepository);

// Inicializar controllers
const authController = new AuthController(login, registrarUsuario);
const usuarioController = new UsuarioController(
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarContrasena,
  registrarUsuario
);
const productoController = new ProductoController(
  crearProducto,
  listarProductos,
  obtenerProductosStockBajo,
  buscarProductoPorCodigo
);
const proveedorController = new ProveedorController(crearProveedor, listarProveedores);
const ventaController = new VentaController(registrarVenta, listarVentas);
const loteController = new LoteController(obtenerLotesVencidos, obtenerLotesPorVencer, obtenerLotesPorProducto);
const reporteController = new ReporteController(
  obtenerGanancias,
  obtenerVentasPorFecha,
  obtenerProductosMasVendidos
);
const compraController = new CompraController(registrarCompra, listarCompras);
const pagoProveedorController = new PagoProveedorController(registrarPago);
const backupController = new BackupController(exportarDatos);

// ============================================
// RUTAS PÚBLICAS (No requieren autenticación)
// ============================================
// Rate limiting para login (prevenir fuerza bruta)
router.post('/auth/login', authRateLimiter, (req, res) => {
  authController.login(req, res).catch((err) => {
    console.error('Error en login:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});
// Rate limiting estricto para registro
router.post('/auth/registrar', strictRateLimiter, (req, res) => {
  authController.registrar(req, res).catch((err) => {
    console.error('Error en registrar:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// RUTAS PROTEGIDAS (Requieren autenticación)
// ============================================

// Rutas de Productos
// - Crear/Editar/Eliminar: Solo DUEÑO
// - Listar/Ver: Todos los usuarios autenticados
router.post('/productos', authenticate, authorize(Rol.DUENO), (req, res) => productoController.crear(req, res).catch((err) => {
  console.error('Error en crear producto:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.get('/productos', authenticate, (req, res) => productoController.listar(req, res).catch((err) => {
  console.error('Error en listar productos:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.get('/productos/stock-bajo', authenticate, (req, res) => productoController.stockBajo(req, res).catch((err) => {
  console.error('Error en stock bajo:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.get('/productos/codigo/:codigo', authenticate, (req, res) => productoController.buscarPorCodigo(req, res).catch((err) => {
  console.error('Error en buscar producto por código:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));

// Rutas de Proveedores
// - Crear/Editar/Eliminar: Solo DUEÑO
// - Listar/Ver: Todos los usuarios autenticados
router.post('/proveedores', authenticate, authorize(Rol.DUENO), (req, res) => proveedorController.crear(req, res).catch((err) => {
  console.error('Error en crear proveedor:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.get('/proveedores', authenticate, (req, res) => proveedorController.listar(req, res).catch((err) => {
  console.error('Error en listar proveedores:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.get('/proveedores/:id/productos', authenticate, (req, res) => {
  const productos = obtenerProductosPorProveedor.execute(req.params.id);
  productos.then(result => {
    if (!result.success) {
      res.status(500).json({ error: result.error.message });
      return;
    }
    res.json({ success: true, data: result.data });
  }).catch(err => {
    console.error('Error en obtener productos por proveedor:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});
router.get('/proveedores/:id/deuda', authenticate, (req, res) => {
  const deuda = obtenerDeudaProveedor.execute(req.params.id);
  deuda.then(result => {
    if (!result.success) {
      res.status(500).json({ error: result.error.message });
      return;
    }
    res.json({ success: true, data: result.data });
  }).catch(err => {
    console.error('Error en obtener deuda proveedor:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});

// Rutas de Ventas
// - Registrar: Todos los usuarios autenticados
// - Listar: Todos los usuarios autenticados
router.post('/ventas', authenticate, (req, res) => ventaController.registrar(req, res));
router.get('/ventas', authenticate, (req, res) => ventaController.listar(req, res));

// Rutas de Lotes
// - Ver: Todos los usuarios autenticados
router.get('/lotes/vencidos', authenticate, (req, res) => loteController.vencidos(req, res).catch((err) => {
  console.error('Error en lotes vencidos:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.get('/lotes/por-vencer', authenticate, (req, res) => loteController.porVencer(req, res).catch((err) => {
  console.error('Error en lotes por vencer:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.get('/lotes/producto/:productoId', authenticate, (req, res) => loteController.porProducto(req, res).catch((err) => {
  console.error('Error en lotes por producto:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));

// Rutas de Compras
// - Registrar: Solo DUEÑO
// - Listar: Solo DUEÑO
router.post('/compras', authenticate, authorize(Rol.DUENO), (req, res) => compraController.registrar(req, res).catch((err) => {
  console.error('Error en registrar compra:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.get('/compras', authenticate, authorize(Rol.DUENO), (req, res) => compraController.listar(req, res).catch((err) => {
  console.error('Error en listar compras:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));

// Rutas de Pagos a Proveedores
// - Registrar: Solo DUEÑO
router.post('/pagos-proveedor', authenticate, authorize(Rol.DUENO), (req, res) => pagoProveedorController.registrar(req, res).catch((err) => {
  console.error('Error en registrar pago:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));

// Rutas de Reportes
// - Ver: Solo DUEÑO
router.get('/reportes/ganancias', authenticate, authorize(Rol.DUENO), (req, res) => reporteController.ganancias(req, res).catch((err) => {
  console.error('Error en reportes ganancias:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.get('/reportes/ventas-por-fecha', authenticate, authorize(Rol.DUENO), (req, res) => reporteController.ventasPorFecha(req, res).catch((err) => {
  console.error('Error en reportes ventas por fecha:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.get('/reportes/productos-mas-vendidos', authenticate, authorize(Rol.DUENO), (req, res) => reporteController.productosMasVendidos(req, res).catch((err) => {
  console.error('Error en reportes productos más vendidos:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));

// Rutas de Backup
// - Exportar: Solo DUEÑO
router.get('/backup/exportar', authenticate, authorize(Rol.DUENO), (req, res) => backupController.exportar(req, res).catch((err) => {
  console.error('Error en exportar backup:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));

// Rutas de Usuarios
// - Todas las operaciones: Solo DUEÑO
router.get('/usuarios', authenticate, authorize(Rol.DUENO), (req, res) => usuarioController.listar(req, res).catch((err) => {
  console.error('Error en listar usuarios:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.get('/usuarios/:id', authenticate, authorize(Rol.DUENO), (req, res) => usuarioController.obtener(req, res).catch((err) => {
  console.error('Error en obtener usuario:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.post('/usuarios', authenticate, authorize(Rol.DUENO), strictRateLimiter, (req, res) => usuarioController.crear(req, res).catch((err) => {
  console.error('Error en crear usuario:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.put('/usuarios/:id', authenticate, authorize(Rol.DUENO), (req, res) => usuarioController.actualizar(req, res).catch((err) => {
  console.error('Error en actualizar usuario:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.delete('/usuarios/:id', authenticate, authorize(Rol.DUENO), (req, res) => usuarioController.eliminar(req, res).catch((err) => {
  console.error('Error en eliminar usuario:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));
router.put('/usuarios/:id/contrasena', authenticate, strictRateLimiter, (req, res) => usuarioController.cambiarContrasena(req, res).catch((err) => {
  console.error('Error en cambiar contraseña:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}));

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
