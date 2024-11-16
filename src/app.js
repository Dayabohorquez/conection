import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import serveIndex from 'serve-index';
import { fileURLToPath } from 'url';

// Importa las rutas
import AuthRouter from './routes/AuthRouter.js';
import carritoItemRoutes from './routes/carritoItemRoutes.js';
import carritoRoutes from './routes/carro.routes.js';
import eventoRoutes from './routes/evento.routes.js';
import fechaEspecialRoutes from './routes/fechaespecial.routes.js';
import opcionadicionalRoutes from './routes/opcionadicionalRouter.js';
import pagoRoutes from './routes/pago.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';
import pedidoitemRoutes from './routes/pedidoItemRoutes.js';
import productoRoutes from './routes/producto.routes.js';
import tipoFlorRoutes from './routes/tipoflor.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';

// Configuración de paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.TZ = 'America/Bogota';

// Inicializa la aplicación Express
const app = express();

// Middleware
app.use(cors({
  origin: 'https://distribuidora-rho.vercel.app', // Asegúrate de no tener una barra al final
  credentials: true,  // Permite el envío de cookies y encabezados de autenticación
}));

app.use(express.json());
app.use(fileUpload({
  createParentPath: true,  // Esto asegura que la ruta para guardar la imagen sea creada si no existe
}));

// Ruta para servir las imágenes subidas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Crear carpetas si no existen
const createUploadDirs = () => {
  const imgPaths = [
    'uploads/img/producto',
    'uploads/img/pedido',
    'uploads/img/fecha_especial',
    'uploads/img/tipo_flor',
    'uploads/img/evento'
  ];

  imgPaths.forEach(imgPath => {
    if (!fs.existsSync(path.join(__dirname, imgPath))) {
      fs.mkdirSync(path.join(__dirname, imgPath), { recursive: true });
    }
  });
};

createUploadDirs(); // Llamada para crear las carpetas

// Configura serveIndex para servir los directorios de imágenes
app.use('/uploads/img/pedido', serveIndex(path.join(__dirname, 'uploads/img/pedido'), { icons: true }));
app.use('/uploads/img/fecha_especial', serveIndex(path.join(__dirname, 'uploads/img/fecha_especial'), { icons: true }));
app.use('/uploads/img/tipo_flor', serveIndex(path.join(__dirname, 'uploads/img/tipo_flor'), { icons: true }));
app.use('/uploads/img/evento', serveIndex(path.join(__dirname, 'uploads/img/evento'), { icons: true }));

// Usar variables de entorno para manejar el entorno
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://conection-1.onrender.com'  // En producción, usa el dominio de producción
  : 'http://localhost:4000';  // En desarrollo, usa localhost

// Endpoint para listar imágenes de productos
app.get('/api/images/producto', (req, res) => {
  const dirPath = path.join(__dirname, 'uploads/img/producto');
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).send('Error al leer el directorio.');
    }
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    const imageURLs = images.map(image => `${baseURL}/uploads/img/producto/${image}`);
    res.json(imageURLs); // Devuelve las URLs completas de las imágenes
  });
});

// Endpoint para subir imágenes
app.post('/api/upload', (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send('No se ha cargado ninguna imagen.');
  }

  const image = req.files.image;
  const uploadPath = path.join(__dirname, 'uploads/img/producto', image.name); // Cambia esta ruta según la categoría de la imagen

  image.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: 'Imagen subida exitosamente', imageUrl: `${baseURL}/uploads/img/producto/${image.name}` });
  });
});

// Monta las rutas con rutas base
app.use(usuarioRoutes, productoRoutes, opcionadicionalRoutes, pedidoRoutes, pedidoitemRoutes, carritoItemRoutes, pagoRoutes, carritoRoutes, eventoRoutes, tipoFlorRoutes, fechaEspecialRoutes, AuthRouter);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal. Intenta nuevamente más tarde.' });
});

app.use('/api', AuthRouter);

export default app;
