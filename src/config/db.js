// config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config(); 

// Crear una instancia de Sequelize para conectarse a la base de datos MySQL
const sequelize = new Sequelize(
  process.env.DB_SCHEMA, // Nombre de la base de datos
  process.env.DB_USER,   // Usuario de la base de datos
  process.env.DB_PASS,   // Contraseña de la base de datos
  {
    host: process.env.DB_HOST, // Dirección del servidor de la base de datos (en este caso, localhost)
    port: process.env.DB_PORT, // Puerto de la base de datos (por defecto MySQL es 3306)
    dialect: 'mysql', // Dialecto de la base de datos
    logging: false,  // Desactiva el log de SQL en la consola (puedes cambiarlo a `console.log` para depurar)
  }
);

// Verificar la conexión a la base de datos
const testConnection = async () => {
  try {
    await sequelize.authenticate(); // Intenta conectar
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1); // Detener el servidor si no se puede conectar a la DB
  }
};

testConnection();

export { sequelize };
