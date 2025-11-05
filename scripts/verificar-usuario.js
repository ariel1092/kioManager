/**
 * Script para verificar usuario en la base de datos
 * Uso: node scripts/verificar-usuario.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function verificarUsuario() {
  try {
    const email = 'dueno@kiosco.com';
    const password = 'admin123';

    console.log('🔍 Verificando usuario...');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}\n`);

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      console.log('Creando usuario...');
      
      const passwordHash = await bcrypt.hash(password, 10);
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre: 'Dueño del Kiosco',
          email: email,
          password: passwordHash,
          rol: 'DUENO',
          activo: true,
        },
      });

      console.log('✅ Usuario creado exitosamente!');
      console.log(`ID: ${nuevoUsuario.id}`);
      console.log(`Email: ${nuevoUsuario.email}`);
      console.log(`Rol: ${nuevoUsuario.rol}`);
      console.log(`Activo: ${nuevoUsuario.activo}`);
      console.log(`Password Hash: ${nuevoUsuario.password.substring(0, 20)}...`);
      
      // Verificar contraseña
      const passwordValid = await bcrypt.compare(password, nuevoUsuario.password);
      console.log(`\n🔐 Verificación de contraseña: ${passwordValid ? '✅ Válida' : '❌ Inválida'}`);
    } else {
      console.log('✅ Usuario encontrado:');
      console.log(`ID: ${usuario.id}`);
      console.log(`Nombre: ${usuario.nombre}`);
      console.log(`Email: ${usuario.email}`);
      console.log(`Rol: ${usuario.rol}`);
      console.log(`Activo: ${usuario.activo}`);
      console.log(`Password Hash: ${usuario.password.substring(0, 20)}...`);
      
      // Verificar contraseña
      const passwordValid = await bcrypt.compare(password, usuario.password);
      console.log(`\n🔐 Verificación de contraseña: ${passwordValid ? '✅ Válida' : '❌ Inválida'}`);
      
      if (!passwordValid) {
        console.log('\n⚠️  La contraseña no coincide. Actualizando contraseña...');
        const passwordHash = await bcrypt.hash(password, 10);
        await prisma.usuario.update({
          where: { id: usuario.id },
          data: { password: passwordHash },
        });
        console.log('✅ Contraseña actualizada');
        
        // Verificar nuevamente
        const nuevoPasswordValid = await bcrypt.compare(password, passwordHash);
        console.log(`🔐 Verificación después de actualizar: ${nuevoPasswordValid ? '✅ Válida' : '❌ Inválida'}`);
      }
    }

    // Listar todos los usuarios
    console.log('\n📋 Todos los usuarios en la base de datos:');
    const todosLosUsuarios = await prisma.usuario.findMany();
    todosLosUsuarios.forEach(u => {
      console.log(`- ${u.email} (${u.rol}) - ${u.activo ? 'Activo' : 'Inactivo'}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verificarUsuario();




