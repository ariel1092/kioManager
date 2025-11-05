/**
 * Script para crear usuario inicial del sistema
 * Uso: node scripts/crear-usuario-inicial.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function crearUsuario() {
  try {
    console.log('👤 Crear Usuario Inicial');
    console.log('========================\n');

    const nombre = await question('Nombre: ');
    const email = await question('Email: ');
    const password = await question('Password: ');
    const rolInput = await question('Rol (DUENO/EMPLEADO) [DUENO]: ');
    const rol = rolInput.trim() || 'DUENO';

    if (!nombre || !email || !password) {
      console.error('❌ Todos los campos son obligatorios');
      process.exit(1);
    }

    if (rol !== 'DUENO' && rol !== 'EMPLEADO') {
      console.error('❌ Rol inválido. Debe ser DUENO o EMPLEADO');
      process.exit(1);
    }

    // Verificar si el email ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      console.error('❌ Ya existe un usuario con este email');
      process.exit(1);
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

    console.log('\n✅ Usuario creado exitosamente!');
    console.log(`ID: ${usuario.id}`);
    console.log(`Nombre: ${usuario.nombre}`);
    console.log(`Email: ${usuario.email}`);
    console.log(`Rol: ${usuario.rol}`);
    console.log('\nAhora puedes iniciar sesión con este usuario.');
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

crearUsuario();

