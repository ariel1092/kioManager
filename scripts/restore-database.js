/**
 * Script de Restauración de Base de Datos
 * 
 * Restaura la base de datos desde un archivo de backup SQL
 * 
 * ⚠️ ADVERTENCIA: Este script eliminará todos los datos actuales y los reemplazará con el backup
 * 
 * Uso:
 *   node scripts/restore-database.js [--file=ruta/backup.sql]
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL no está definido en el archivo .env');
  process.exit(1);
}

// Parsear DATABASE_URL
const urlMatch = DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

if (!urlMatch) {
  console.error('❌ Error: DATABASE_URL tiene un formato inválido');
  process.exit(1);
}

const [, usuario, password, host, puerto, database] = urlMatch;

// Obtener ruta del archivo de backup
const args = process.argv.slice(2);
let backupFile = null;

args.forEach(arg => {
  if (arg.startsWith('--file=')) {
    backupFile = arg.split('=')[1];
  }
});

if (!backupFile) {
  // Buscar el último backup en el directorio backups
  const backupsDir = path.join(process.cwd(), 'backups');
  
  if (!fs.existsSync(backupsDir)) {
    console.error('❌ Error: No existe el directorio de backups');
    console.error('   Ejecuta primero: node scripts/backup-database.js');
    process.exit(1);
  }

  const backups = fs.readdirSync(backupsDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => ({
      name: file,
      path: path.join(backupsDir, file),
      time: fs.statSync(path.join(backupsDir, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  if (backups.length === 0) {
    console.error('❌ Error: No se encontraron archivos de backup');
    console.error('   Ejecuta primero: node scripts/backup-database.js');
    process.exit(1);
  }

  backupFile = backups[0].path;
  console.log(`📦 Usando el último backup: ${backups[0].name}`);
}

// Verificar que el archivo existe
if (!fs.existsSync(backupFile)) {
  console.error(`❌ Error: El archivo de backup no existe: ${backupFile}`);
  process.exit(1);
}

console.log('\n⚠️  ADVERTENCIA: Esta operación eliminará TODOS los datos actuales');
console.log(`📁 Archivo de backup: ${backupFile}`);
console.log(`📦 Base de datos: ${database}`);

// Confirmación del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\n¿Estás seguro de que quieres continuar? (escribe "SI" para confirmar): ', (answer) => {
  rl.close();

  if (answer.trim().toUpperCase() !== 'SI') {
    console.log('❌ Restauración cancelada');
    process.exit(0);
  }

  console.log('\n🔄 Iniciando restauración...');

  // Comando psql para restaurar
  const psqlCommand = `psql -h ${host} -p ${puerto} -U ${usuario} -d ${database} -f "${backupFile}"`;

  // Establecer variable de entorno para la contraseña
  const env = { ...process.env, PGPASSWORD: password };

  exec(psqlCommand, { env }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error al restaurar el backup:');
      console.error(error.message);
      
      if (error.message.includes('psql') && error.message.includes('not found')) {
        console.error('\n💡 Solución: Instala PostgreSQL client tools');
        console.error('   Windows: Descarga desde https://www.postgresql.org/download/windows/');
        console.error('   Linux: sudo apt-get install postgresql-client');
        console.error('   Mac: brew install postgresql');
      }
      
      process.exit(1);
    }

    if (stderr && !stderr.includes('NOTICE')) {
      console.warn('⚠️  Advertencias:');
      console.warn(stderr);
    }

    console.log('\n✅ Restauración completada exitosamente!');
    console.log('📊 Base de datos restaurada desde el backup');
  });
});




