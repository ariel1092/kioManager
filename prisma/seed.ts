import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...\n');

  // ============================================
  // SEED DE PROVEEDORES
  // ============================================
  console.log('📦 Creando proveedores...');

  const proveedores = [
    {
      nombre: 'Arcor S.A.',
      contacto: 'Juan Pérez',
      telefono: '0800-123-4567',
      email: 'ventas@arcor.com.ar',
      direccion: 'Av. Libertador 1234, Buenos Aires',
    },
    {
      nombre: 'Coca-Cola Argentina',
      contacto: 'María González',
      telefono: '0800-555-1234',
      email: 'distribuidores@coca-cola.com.ar',
      direccion: 'Av. del Libertador 1000, CABA',
    },
    {
      nombre: 'PepsiCo Argentina',
      contacto: 'Carlos Rodríguez',
      telefono: '0800-222-3333',
      email: 'ventas@pepsico.com.ar',
      direccion: 'Av. Corrientes 2000, Buenos Aires',
    },
    {
      nombre: 'Nestlé Argentina',
      contacto: 'Ana Martínez',
      telefono: '0800-444-5555',
      email: 'ventas@nestle.com.ar',
      direccion: 'Av. Santa Fe 1500, CABA',
    },
    {
      nombre: 'Bagley Argentina',
      contacto: 'Roberto Sánchez',
      telefono: '0800-666-7777',
      email: 'comercial@bagley.com.ar',
      direccion: 'Ruta 9 Km 45, Buenos Aires',
    },
    {
      nombre: 'Philip Morris Argentina',
      contacto: 'Laura Fernández',
      telefono: '0800-888-9999',
      email: 'ventas@pmintl.com.ar',
      direccion: 'Av. Leandro N. Alem 1000, CABA',
    },
    {
      nombre: 'Felfort',
      contacto: 'Diego López',
      telefono: '0800-111-2222',
      email: 'ventas@felfort.com.ar',
      direccion: 'Av. Rivadavia 5000, Buenos Aires',
    },
    {
      nombre: 'Terrabusi',
      contacto: 'Sofía García',
      telefono: '0800-333-4444',
      email: 'comercial@terrabusi.com.ar',
      direccion: 'Av. Córdoba 2000, CABA',
    },
  ];

  const proveedoresCreados = await Promise.all(
    proveedores.map(async (proveedor) => {
      const existente = await prisma.proveedor.findFirst({
        where: { nombre: proveedor.nombre },
      });

      if (existente) {
        console.log(`  ⏭️  Proveedor "${proveedor.nombre}" ya existe`);
        return existente;
      }

      const creado = await prisma.proveedor.create({
        data: proveedor,
      });
      console.log(`  ✅ Proveedor creado: ${proveedor.nombre}`);
      return creado;
    })
  );

  console.log(`\n✅ ${proveedoresCreados.length} proveedores procesados\n`);

  // ============================================
  // SEED DE PRODUCTOS
  // ============================================
  console.log('🛍️  Creando productos...');

  // Función helper para obtener proveedor por nombre
  const getProveedorId = (nombre: string) => {
    const proveedor = proveedoresCreados.find((p) => p.nombre === nombre);
    return proveedor?.id || null;
  };

  const productos = [
    // ALFAJORES
    {
      codigo: 'ALF001',
      nombre: 'Alfajor Havanna Chocolate',
      descripcion: 'Alfajor de chocolate con dulce de leche',
      categoria: 'Alfajores',
      precioCompra: 150.00,
      precioVenta: 250.00,
      stockMinimo: 10,
      tieneVencimiento: true,
      proveedorId: null, // Havanna no está en la lista de proveedores
    },
    {
      codigo: 'ALF002',
      nombre: 'Alfajor Guaymallén Blanco',
      descripcion: 'Alfajor blanco tradicional',
      categoria: 'Alfajores',
      precioCompra: 80.00,
      precioVenta: 120.00,
      stockMinimo: 15,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Arcor S.A.'),
    },
    {
      codigo: 'ALF003',
      nombre: 'Alfajor Jorgito Chocolate',
      descripcion: 'Alfajor de chocolate',
      categoria: 'Alfajores',
      precioCompra: 90.00,
      precioVenta: 140.00,
      stockMinimo: 12,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Arcor S.A.'),
    },
    {
      codigo: 'ALF004',
      nombre: 'Alfajor Terrabusi Triple',
      descripcion: 'Alfajor triple chocolate',
      categoria: 'Alfajores',
      precioCompra: 120.00,
      precioVenta: 180.00,
      stockMinimo: 10,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Terrabusi'),
    },

    // GOLOSINAS Y CHOCOLATES
    {
      codigo: 'CHO001',
      nombre: 'Chocolate Milka Oreo',
      descripcion: 'Tableta de chocolate con galletas Oreo',
      categoria: 'Chocolates',
      precioCompra: 200.00,
      precioVenta: 320.00,
      stockMinimo: 8,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Nestlé Argentina'),
    },
    {
      codigo: 'CHO002',
      nombre: 'Chocolate Águila Clásico',
      descripcion: 'Tableta de chocolate con leche',
      categoria: 'Chocolates',
      precioCompra: 150.00,
      precioVenta: 250.00,
      stockMinimo: 10,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Arcor S.A.'),
    },
    {
      codigo: 'CHO003',
      nombre: 'Chocolate Bon o Bon',
      descripcion: 'Bombón de chocolate y maní',
      categoria: 'Chocolates',
      precioCompra: 180.00,
      precioVenta: 280.00,
      stockMinimo: 12,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Arcor S.A.'),
    },
    {
      codigo: 'GOL001',
      nombre: 'Caramelos Sugus',
      descripcion: 'Caramelos de frutas surtidos',
      categoria: 'Golosinas',
      precioCompra: 100.00,
      precioVenta: 180.00,
      stockMinimo: 5,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Arcor S.A.'),
    },

    // BEBIDAS
    {
      codigo: 'BEB001',
      nombre: 'Coca-Cola 500ml',
      descripcion: 'Gaseosa cola 500ml',
      categoria: 'Bebidas',
      precioCompra: 120.00,
      precioVenta: 200.00,
      stockMinimo: 20,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Coca-Cola Argentina'),
    },
    {
      codigo: 'BEB002',
      nombre: 'Coca-Cola 1.5L',
      descripcion: 'Gaseosa cola 1.5 litros',
      categoria: 'Bebidas',
      precioCompra: 180.00,
      precioVenta: 300.00,
      stockMinimo: 15,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Coca-Cola Argentina'),
    },
    {
      codigo: 'BEB003',
      nombre: 'Pepsi 500ml',
      descripcion: 'Gaseosa cola 500ml',
      categoria: 'Bebidas',
      precioCompra: 110.00,
      precioVenta: 190.00,
      stockMinimo: 20,
      tieneVencimiento: true,
      proveedorId: getProveedorId('PepsiCo Argentina'),
    },
    {
      codigo: 'BEB004',
      nombre: 'Sprite 500ml',
      descripcion: 'Gaseosa lima-limón 500ml',
      categoria: 'Bebidas',
      precioCompra: 120.00,
      precioVenta: 200.00,
      stockMinimo: 15,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Coca-Cola Argentina'),
    },
    {
      codigo: 'BEB005',
      nombre: 'Agua Villavicencio 500ml',
      descripcion: 'Agua mineral natural',
      categoria: 'Bebidas',
      precioCompra: 80.00,
      precioVenta: 150.00,
      stockMinimo: 25,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Coca-Cola Argentina'),
    },
    {
      codigo: 'BEB006',
      nombre: 'Agua sin Gas 1.5L',
      descripcion: 'Agua sin gas 1.5 litros',
      categoria: 'Bebidas',
      precioCompra: 100.00,
      precioVenta: 180.00,
      stockMinimo: 20,
      tieneVencimiento: true,
      proveedorId: null,
    },

    // SNACKS
    {
      codigo: 'SNK001',
      nombre: 'Papas Fritas Lays Clásicas',
      descripcion: 'Papas fritas clásicas 150g',
      categoria: 'Snacks',
      precioCompra: 150.00,
      precioVenta: 250.00,
      stockMinimo: 15,
      tieneVencimiento: true,
      proveedorId: getProveedorId('PepsiCo Argentina'),
    },
    {
      codigo: 'SNK002',
      nombre: 'Chizitos Clásicos',
      descripcion: 'Snack de maíz sabor queso 200g',
      categoria: 'Snacks',
      precioCompra: 140.00,
      precioVenta: 230.00,
      stockMinimo: 12,
      tieneVencimiento: true,
      proveedorId: getProveedorId('PepsiCo Argentina'),
    },
    {
      codigo: 'SNK003',
      nombre: 'Palitos Salados',
      descripcion: 'Palitos salados 200g',
      categoria: 'Snacks',
      precioCompra: 130.00,
      precioVenta: 220.00,
      stockMinimo: 10,
      tieneVencimiento: true,
      proveedorId: getProveedorId('PepsiCo Argentina'),
    },
    {
      codigo: 'SNK004',
      nombre: 'Doritos Nacho',
      descripcion: 'Nachos sabor queso 150g',
      categoria: 'Snacks',
      precioCompra: 160.00,
      precioVenta: 270.00,
      stockMinimo: 12,
      tieneVencimiento: true,
      proveedorId: getProveedorId('PepsiCo Argentina'),
    },

    // CIGARRILLOS
    {
      codigo: 'CIG001',
      nombre: 'Marlboro Rojo',
      descripcion: 'Cigarrillos Marlboro rojo',
      categoria: 'Cigarrillos',
      precioCompra: 450.00,
      precioVenta: 600.00,
      stockMinimo: 5,
      tieneVencimiento: false,
      proveedorId: getProveedorId('Philip Morris Argentina'),
    },
    {
      codigo: 'CIG002',
      nombre: 'Marlboro Gold',
      descripcion: 'Cigarrillos Marlboro dorado',
      categoria: 'Cigarrillos',
      precioCompra: 450.00,
      precioVenta: 600.00,
      stockMinimo: 5,
      tieneVencimiento: false,
      proveedorId: getProveedorId('Philip Morris Argentina'),
    },
    {
      codigo: 'CIG003',
      nombre: 'Lucky Strike',
      descripcion: 'Cigarrillos Lucky Strike',
      categoria: 'Cigarrillos',
      precioCompra: 420.00,
      precioVenta: 580.00,
      stockMinimo: 5,
      tieneVencimiento: false,
      proveedorId: getProveedorId('Philip Morris Argentina'),
    },

    // OTROS
    {
      codigo: 'OTR001',
      nombre: 'Chicles Beldent',
      descripcion: 'Chicles sabor menta',
      categoria: 'Golosinas',
      precioCompra: 90.00,
      precioVenta: 150.00,
      stockMinimo: 10,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Arcor S.A.'),
    },
    {
      codigo: 'OTR002',
      nombre: 'Galletas Oreo',
      descripcion: 'Galletas Oreo clásicas',
      categoria: 'Galletas',
      precioCompra: 180.00,
      precioVenta: 300.00,
      stockMinimo: 8,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Nestlé Argentina'),
    },
    {
      codigo: 'OTR003',
      nombre: 'Galletas Ritz',
      descripcion: 'Galletas saladas Ritz',
      categoria: 'Galletas',
      precioCompra: 160.00,
      precioVenta: 280.00,
      stockMinimo: 10,
      tieneVencimiento: true,
      proveedorId: getProveedorId('PepsiCo Argentina'),
    },
    {
      codigo: 'OTR004',
      nombre: 'Turrón de Maní',
      descripcion: 'Turrón de maní tradicional',
      categoria: 'Golosinas',
      precioCompra: 100.00,
      precioVenta: 180.00,
      stockMinimo: 8,
      tieneVencimiento: true,
      proveedorId: getProveedorId('Arcor S.A.'),
    },
  ];

  const productosCreados = await Promise.all(
    productos.map(async (producto) => {
      const existente = await prisma.producto.findUnique({
        where: { codigo: producto.codigo },
      });

      if (existente) {
        console.log(`  ⏭️  Producto "${producto.nombre}" ya existe`);
        return existente;
      }

      const creado = await prisma.producto.create({
        data: producto,
      });
      console.log(`  ✅ Producto creado: ${producto.nombre}`);
      return creado;
    })
  );

  console.log(`\n✅ ${productosCreados.length} productos procesados\n`);

  // ============================================
  // SEED DE LOTES (para productos con vencimiento)
  // ============================================
  console.log('📦 Creando lotes para productos con vencimiento...');

  const hoy = new Date();
  const lotes = [];

  for (const producto of productosCreados) {
    if (!producto.tieneVencimiento) continue;

    // Crear 1-3 lotes por producto con diferentes fechas de vencimiento
    const cantidadLotes = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < cantidadLotes; i++) {
      // Fecha de vencimiento entre 30 y 180 días desde hoy
      const diasVencimiento = Math.floor(Math.random() * 150) + 30;
      const fechaVencimiento = new Date(hoy);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + diasVencimiento);

      // Cantidad entre 10 y 50 unidades por lote
      const cantidad = Math.floor(Math.random() * 41) + 10;
      const numeroLote = `LOT-${producto.codigo}-${Date.now()}-${i}`;

      lotes.push({
        numeroLote,
        fechaVencimiento,
        cantidad,
        cantidadVendida: 0,
        productoId: producto.id,
      });
    }
  }

  // Agrupar lotes por producto para actualizar stock correctamente
  const lotesPorProducto = new Map<string, number>();
  
  for (const lote of lotes) {
    const cantidadActual = lotesPorProducto.get(lote.productoId) || 0;
    lotesPorProducto.set(lote.productoId, cantidadActual + lote.cantidad);
  }

  // Crear lotes
  const lotesCreados = await Promise.all(
    lotes.map(async (lote) => {
      const creado = await prisma.lote.create({
        data: lote,
      });
      return creado;
    })
  );

  // Actualizar stock de productos
  for (const [productoId, cantidadTotal] of lotesPorProducto.entries()) {
    const producto = await prisma.producto.findUnique({
      where: { id: productoId },
    });

    if (producto) {
      await prisma.producto.update({
        where: { id: productoId },
        data: {
          stockActual: producto.stockActual + cantidadTotal,
        },
      });
    }
  }

  console.log(`✅ ${lotesCreados.length} lotes creados\n`);

  // ============================================
  // SEED DE COMPRAS Y PAGOS (escenarios variados)
  // ============================================
  console.log('💳 Creando compras y pagos de ejemplo...');

  const proveedorArcor = proveedoresCreados.find(p => p.nombre === 'Arcor S.A.');
  const proveedorCoca = proveedoresCreados.find(p => p.nombre === 'Coca-Cola Argentina');
  const proveedorPepsi = proveedoresCreados.find(p => p.nombre === 'PepsiCo Argentina');

  if (proveedorArcor && proveedorCoca && proveedorPepsi) {
    const prodArcor = productosCreados.filter(p => p.proveedorId === proveedorArcor.id).slice(0, 2);
    const prodCoca = productosCreados.filter(p => p.proveedorId === proveedorCoca.id).slice(0, 2);
    const prodPepsi = productosCreados.filter(p => p.proveedorId === proveedorPepsi.id).slice(0, 2);

    const hoy2 = new Date();
    const hace15 = new Date(hoy2); hace15.setDate(hace15.getDate() - 15);
    const hace45 = new Date(hoy2); hace45.setDate(hace45.getDate() - 45);
    const en15 = new Date(hoy2); en15.setDate(en15.getDate() + 15);

    // 1) Compra pagada (contado)
    const compraPagada = await prisma.compra.create({
      data: {
        numeroFactura: 'FAC-0001',
        fechaCompra: hace15,
        total: 0,
        formaPago: 'contado',
        pagado: true,
        montoPagado: 0,
        proveedorId: proveedorArcor.id,
      },
    });

    let totalPagada = 0;
    for (const p of prodArcor) {
      const cantidad = 10;
      const precio = Number(p.precioCompra);
      totalPagada += cantidad * precio;
      await prisma.compraItem.create({
        data: {
          compraId: compraPagada.id,
          productoId: p.id,
          cantidad,
          precioUnitario: precio,
          subtotal: cantidad * precio,
        },
      });
    }
    await prisma.compra.update({
      where: { id: compraPagada.id },
      data: { total: totalPagada, montoPagado: totalPagada },
    });

    // 2) Compra a crédito pendiente (a vencer)
    const compraAVencer = await prisma.compra.create({
      data: {
        numeroFactura: 'FAC-0002',
        fechaCompra: hoy2,
        total: 0,
        formaPago: 'credito',
        fechaVencimiento: en15,
        pagado: false,
        montoPagado: 0,
        proveedorId: proveedorCoca.id,
      },
    });
    let totalAVencer = 0;
    for (const p of prodCoca) {
      const cantidad = 20;
      const precio = Number(p.precioCompra);
      totalAVencer += cantidad * precio;
      await prisma.compraItem.create({
        data: {
          compraId: compraAVencer.id,
          productoId: p.id,
          cantidad,
          precioUnitario: precio,
          subtotal: cantidad * precio,
        },
      });
    }
    await prisma.compra.update({ where: { id: compraAVencer.id }, data: { total: totalAVencer } });

    // 3) Compra a crédito vencida (sin pagar)
    const compraVencida = await prisma.compra.create({
      data: {
        numeroFactura: 'FAC-0003',
        fechaCompra: hace45,
        total: 0,
        formaPago: 'credito',
        fechaVencimiento: hace15,
        pagado: false,
        montoPagado: 0,
        proveedorId: proveedorPepsi.id,
      },
    });
    let totalVencida = 0;
    for (const p of prodPepsi) {
      const cantidad = 15;
      const precio = Number(p.precioCompra);
      totalVencida += cantidad * precio;
      await prisma.compraItem.create({
        data: {
          compraId: compraVencida.id,
          productoId: p.id,
          cantidad,
          precioUnitario: precio,
          subtotal: cantidad * precio,
        },
      });
    }
    await prisma.compra.update({ where: { id: compraVencida.id }, data: { total: totalVencida } });

    // 4) Pagos: parcial a compra vencida y pago general sin compra
    await prisma.pagoProveedor.create({
      data: {
        proveedorId: proveedorPepsi.id,
        compraId: compraVencida.id,
        fecha: new Date(),
        monto: Number(totalVencida) * 0.5,
        metodoPago: 'transferencia',
      },
    });

    await prisma.pagoProveedor.create({
      data: {
        proveedorId: proveedorArcor.id,
        compraId: null,
        fecha: new Date(),
        monto: 5000,
        metodoPago: 'efectivo',
        observaciones: 'Pago general de cuenta corriente',
      },
    });
  }

  console.log('🎉 Seed completado exitosamente!');
  console.log(`\n📊 Resumen:`);
  console.log(`   - ${proveedoresCreados.length} proveedores`);
  console.log(`   - ${productosCreados.length} productos`);
  console.log(`   - ${lotesCreados.length} lotes`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

