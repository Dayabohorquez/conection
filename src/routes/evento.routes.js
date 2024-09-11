import { Router } from 'express';
import EventoController from '../controllers/evento.controller.js';

const router = Router();

// Crear un nuevo evento
router.post('/api/eventos', EventoController.createEvento);

// Obtener todos los eventos
router.get('/api/eventos', EventoController.getAllEventos);

// Obtener un evento por ID
router.get('/api/eventos/:id', EventoController.getEventoById);

// Actualizar un evento por ID
router.put('/api/eventos/:id', EventoController.updateEvento);

// Eliminar un evento por ID
router.delete('/api/eventos/:id', EventoController.deleteEvento);

export default router;
