import { Router } from 'express';
import EnvioController from '../controllers/envio.controller.js';

const router = Router();

// Crear un nuevo envío
router.post('/api/envios', EnvioController.createEnvio);

// Obtener todos los envíos
router.get('/api/envios', EnvioController.getAllEnvios);

// Obtener un envío por ID
router.get('/api/envios/:id', EnvioController.getEnvioById);

// Actualizar un envío por ID
router.put('/api/envios/:id', EnvioController.updateEnvio);

// Eliminar un envío por ID
router.delete('/api/envios/:id', EnvioController.deleteEnvio);

export default router;

