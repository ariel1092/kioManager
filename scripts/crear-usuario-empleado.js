/**
 * Script para crear usuario empleado inicial
 * Uso: node scripts/crear-usuario-empleado.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function crearUsuarioEmpleado() {
  try {
    const nombre = 'Empleado del Kiosco';
    const email = 'empleado@kiosco.com';
    const password = 'empleado123';
    const rol = 'EMPLEADO';

    // Verificar si el email ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      console.log('ℹ️  Ya existe un usuario con este email');
      console.log(`Email: ${usuarioExistente.email}`);
      console.log(`Rol: ${usuarioExistente.rol}`);
      return;
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: passwordHash,
        rol,
        activo: true,
      },
    });

    console.log('\n✅ Usuario empleado creado exitosamente!');
    console.log('==========================================');
    console.log(`ID: ${usuario.id}`);
    console.log(`Nombre: ${usuario.nombre}`);
    console.log(`Email: ${usuario.email}`);
    console.log(`Rol: ${usuario.rol}`);
    console.log('\n📝 Credenciales de acceso:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\n⚠️  Guarda estas credenciales de forma segura.');
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

crearUsuarioEmpleado();



