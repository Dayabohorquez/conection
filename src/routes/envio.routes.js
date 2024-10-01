import { Router } from 'express';
import EnvioController from '../controllers/envio.controller.js';

const router = Router();

router.post('/api/envios', EnvioController.createEnvio);
router.get('/api/envios', EnvioController.getAllEnvios);
router.get('/api/envios/:id', EnvioController.getEnvioById);
router.put('/api/envios/:id', EnvioController.updateEnvio);
router.put('/api/envios/estado/:id', EnvioController.updateEstadoEnvio);
router.delete('/api/envios/:id', EnvioController.deleteEnvio);

export default router;

