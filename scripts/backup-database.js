/**
 * Script de Backup de Base de Datos
 * 
 * Genera un backup completo de la base de datos PostgreSQL
 * Incluye todas las tablas: usuarios, proveedores, productos, ventas, compras, pagos, lotes
 * 
 * Uso:
 *   node scripts/backup-database.js [--output=ruta/archivo.sql]
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL no está definido en el archivo .env');
  process.exit(1);
}

// Parsear DATABASE_URL
// Formato: postgresql://usuario:password@host:puerto/database
const urlMatch = DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

if (!urlMatch) {
  console.error('❌ Error: DATABASE_URL tiene un formato inválido');
  process.exit(1);
}

const [, usuario, password, host, puerto, database] = urlMatch;

// Obtener ruta de salida del argumento o usar default
const args = process.argv.slice(2);
let outputPath = null;

args.forEach(arg => {
  if (arg.startsWith('--output=')) {
    outputPath = arg.split('=')[1];
  }
});

if (!outputPath) {
  // Crear directorio backups si no existe
  const backupsDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  // Nombre del archivo: backup_YYYY-MM-DD_HH-MM-SS.sql
  const fecha = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  outputPath = path.join(backupsDir, `backup_${fecha}.sql`);
}

console.log('🔄 Iniciando backup de la base de datos...');
console.log(`📦 Base de datos: ${database}`);
console.log(`💾 Archivo de salida: ${outputPath}`);

// Comando pg_dump
const pgDumpCommand = `pg_dump -h ${host} -p ${puerto} -U ${usuario} -d ${database} -F p -f "${outputPath}"`;

// Establecer variable de entorno para la contraseña
const env = { ...process.env, PGPASSWORD: password };

exec(pgDumpCommand, { env }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error al realizar el backup:');
    console.error(error.message);
    
    // Verificar si pg_dump está instalado
    if (error.message.includes('pg_dump') && error.message.includes('not found')) {
      console.error('\n💡 Solución: Instala PostgreSQL client tools');
      console.error('   Windows: Descarga desde https://www.postgresql.org/download/windows/');
      console.error('   Linux: sudo apt-get install postgresql-client');
      console.error('   Mac: brew install postgresql');
    }
    
    process.exit(1);
  }

  if (stderr) {
    console.warn('⚠️  Advertencias:');
    console.warn(stderr);
  }

  // Verificar que el archivo se creó
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n✅ Backup completado exitosamente!`);
    console.log(`📊 Tamaño del archivo: ${sizeMB} MB`);
    console.log(`📁 Ubicación: ${outputPath}`);
  } else {
    console.error('❌ Error: El archivo de backup no se creó');
    process.exit(1);
  }
});

