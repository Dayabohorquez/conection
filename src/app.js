import express from 'express';
import fileUpload from 'express-fileupload';
import usuarioRoutes from './routes/usuario.routes.js';
import productoRoutes from './routes/producto.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';
import pedido_ventaRoutes from './routes/pedido_venta.routes.js';
import pagoRoutes from './routes/pago.routes.js';
import informe_pedidoRoutes from './routes/informe_pedido.routes.js';
import historial_pedidoRoutes from './routes/historial_pedido.routes.js';
import envioRoutes from './routes/envio.routes.js';
import detalle_pedidoRoutes from './routes/detalle_pedido.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual usando __filename y __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para JSON y CORS
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());  


// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usar las rutas de la aplicación
app.use(usuarioRoutes, productoRoutes, pedidoRoutes, pedido_ventaRoutes, pagoRoutes, informe_pedidoRoutes, historial_pedidoRoutes, envioRoutes, detalle_pedidoRoutes)

export default app;
