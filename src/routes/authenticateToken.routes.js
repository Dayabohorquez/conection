import express from 'express';
import { authenticateToken } from './path/to/authMiddleware.js'; // Asegúrate de que la ruta sea correcta
import { clientPage, sellerPage, deliveryPage, adminPage } from './path/to/controllers.js'; // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Ruta protegida para clientes
router.get('/Cliente', authenticateToken, clientPage);

// Ruta protegida para vendedores
router.get('/Vendedor', authenticateToken, sellerPage);

// Ruta protegida para domiciliarios
router.get('/Domiciliario', authenticateToken, deliveryPage);

// Ruta protegida para administradores
router.get('/Administrador', authenticateToken, adminPage);

export default router;
