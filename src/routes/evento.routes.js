import { Router } from 'express';
import EventoController from '../controllers/evento.controller.js';

const router = Router();

// Crear un nuevo evento
router.post('/api/eventos', EventoController.crearEvento);

// Obtener todos los eventos
router.get('/api/eventos', EventoController.obtenerEventos);

// Obtener un evento por ID
router.get('/api/eventos/:id_evento', EventoController.obtenerEventoPorId);

// Actualizar un evento por ID
router.put('/api/eventos/:id_evento', EventoController.actualizarEvento);

// Eliminar un evento por ID
router.delete('/api/eventos/:id_evento', EventoController.eliminarEvento);

export default router;
