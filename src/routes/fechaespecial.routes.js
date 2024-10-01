// src/routes/fechaespecial.routes.js
import { Router } from 'express';
import FechaEspecialController from '../controllers/fechaespecial.controller.js';

const router = Router();

// Crear una nueva fecha especial
router.post('/api/fechas-especiales', FechaEspecialController.createFechaEspecial);

// Obtener todas las fechas especiales
router.get('/api/fechas-especiales', FechaEspecialController.getAllFechasEspeciales);

// Obtener una fecha especial por ID
router.get('/api/fechas-especiales/:id', FechaEspecialController.getFechaEspecialById);

// Actualizar una fecha especial por ID
router.put('/api/fechas-especiales/:id_fecha_especial', FechaEspecialController.actualizarFechaEspecial);

// Eliminar una fecha especial por ID
router.delete('/api/fechas-especiales/:id', FechaEspecialController.deleteFechaEspecial);

export default router;
