import app from './app.js';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import ProductoController from './controllers/producto.controller.js';

dotenv.config();

const port = process.env.PORT || 4000;

async function main() {
  try {
    // Conectar con la base de datos
    await sequelize.sync();
    // Iniciar el servidor
    app.listen(process.env.PORT, () => {
      console.log(`App escuchando en el puerto: ${port}`);
    });

    // Configurar el intervalo para verificar productos agotados cada 10 segundos (10000 ms)
    setInterval(async () => {
      try {
        // Llamar a la función estática que verifica y envía el correo si hay productos agotados
        await ProductoController.obtenerProductosAgotadosYNotificar(); // Llamar al método estático directamente desde la clase
      } catch (error) {
        console.error('Error al verificar productos agotados:', error);
      }
    }, 10000); // 10000 ms = 10 segundos
    
  } catch (error) {
    console.error('No se conectó la base de datos:', error);
  }
}

main();
