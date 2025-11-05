/**
 * Script para actualizar el email del usuario dueño (sin ñ)
 * Uso: node scripts/actualizar-usuario-dueno.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function actualizarUsuarioDueno() {
  try {
    // Buscar usuario con email antiguo
    const usuarioAntiguo = await prisma.usuario.findUnique({
      where: { email: 'dueño@kiosco.com' },
    });

    if (usuarioAntiguo) {
      // Actualizar email
      await prisma.usuario.update({
        where: { id: usuarioAntiguo.id },
        data: { email: 'dueno@kiosco.com' },
      });

      console.log('✅ Email actualizado exitosamente!');
      console.log(`Email anterior: dueño@kiosco.com`);
      console.log(`Email nuevo: dueno@kiosco.com`);
    } else {
      // Si no existe, verificar si ya existe el nuevo email
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: 'dueno@kiosco.com' },
      });

      if (usuarioExistente) {
        console.log('ℹ️  El usuario ya existe con el email correcto: dueno@kiosco.com');
      } else {
        console.log('ℹ️  No se encontró usuario con el email antiguo. Creando nuevo usuario...');
        
        // Crear nuevo usuario
        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash('admin123', 10);

        const nuevoUsuario = await prisma.usuario.create({
          data: {
            nombre: 'Dueño del Kiosco',
            email: 'dueno@kiosco.com',
            password: passwordHash,
            rol: 'DUENO',
            activo: true,
          },
        });

        console.log('✅ Usuario creado exitosamente!');
        console.log(`ID: ${nuevoUsuario.id}`);
        console.log(`Email: ${nuevoUsuario.email}`);
        console.log(`Rol: ${nuevoUsuario.rol}`);
      }
    }

    console.log('\n📝 Credenciales de acceso:');
    console.log(`Email: dueno@kiosco.com`);
    console.log(`Password: admin123`);
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

actualizarUsuarioDueno();



