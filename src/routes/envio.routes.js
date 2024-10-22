import { Router } from 'express';
import EnvioController from '../controllers/envio.controller.js';

const router = Router();

router.post('/api/envios', EnvioController.crearEnvio);
router.get('/api/envios', EnvioController.obtenerEnvios);
router.get('/api/envios/:id', EnvioController.obtenerEnvioPorId);
router.put('/api/envios/:id', EnvioController.actualizarEnvio);
router.put('/api/envios/estado/:id', EnvioController.cambiarEstadoEnvio);
router.delete('/api/envios/:id_envio', EnvioController.eliminarEnvio);

export default router;

