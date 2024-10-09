import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import serveIndex from 'serve-index';
import fs from 'fs'; // Asegúrate de importar fs

// Importa las rutas
import usuarioRoutes from './routes/usuario.routes.js';
import productoRoutes from './routes/producto.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';
import pagoRoutes from './routes/pago.routes.js';
import historialPedidoRoutes from './routes/historialpedido.routes.js';
import envioRoutes from './routes/envio.routes.js';
import detallePedidoRoutes from './routes/detallepedido.routes.js';
import carritoRoutes from './routes/carro.routes.js';
import eventoRoutes from './routes/evento.routes.js';
import tipoFlorRoutes from './routes/tipoflor.routes.js';
import fechaEspecialRoutes from './routes/fechaespecial.routes.js';

// Configuración de paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializa la aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  createParentPath: true,
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint para listar imágenes
app.get('/api/images/producto', (req, res) => {
    const dirPath = path.join(__dirname, 'uploads/img/producto');
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return res.status(500).send('Error al leer el directorio.');
        }
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.json(images);
    });
});

app.use('/uploads/img/pedido', serveIndex(path.join(__dirname, 'uploads/img/pedido'), { icons: true }));
app.use('/uploads/img/fecha_especial', serveIndex(path.join(__dirname, 'uploads/img/fecha_especial'), { icons: true }));
app.use('/uploads/img/tipo_flor', serveIndex(path.join(__dirname, 'uploads/img/tipo_flor'), { icons: true }));
app.use('/uploads/img/evento', serveIndex(path.join(__dirname, 'uploads/img/evento'), { icons: true }));

// Monta las rutas con rutas base
app.use(usuarioRoutes, productoRoutes, pedidoRoutes, pagoRoutes, historialPedidoRoutes, envioRoutes, detallePedidoRoutes, carritoRoutes, eventoRoutes, tipoFlorRoutes, fechaEspecialRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal. Intenta nuevamente más tarde.' });
});

export default app;
