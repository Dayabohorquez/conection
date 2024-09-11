import { Router } from 'express';
import ProductoController from '../controllers/producto.controller.js';
import fileUpload from 'express-fileupload'; // Asegúrate de instalar este paquete para manejar archivos

// Inicializamos el enrutador
const router = Router();

// Middleware para manejar archivos
router.use(fileUpload());

// Obtener todos los productos
router.get('/api/productos', ProductoController.obtenerProductos);

// Obtener producto por ID
router.get('/api/producto/:idProducto', ProductoController.obtenerProductoPorId);

// Crear nuevo producto
router.post('/api/producto', ProductoController.crearProducto);

// Actualizar un producto existente
router.put('/api/producto/:idProducto', ProductoController.actualizarProducto);

// Cambiar estado de un producto (activado/desactivado)
router.patch('/api/producto/:idProducto/estado', ProductoController.cambiarEstadoProducto);

// Eliminar un producto
router.delete('/api/producto/:idProducto', ProductoController.eliminarProducto);

export default router;
