import { Router } from 'express';
import FechaEspecialController from '../controllers/fechaEspecial.controller.js';
import fileUpload from 'express-fileupload'; // Asegúrate de instalar express-fileupload

const router = Router();

// Middleware para manejar la carga de archivos
router.use(fileUpload());

// Crear una nueva fecha especial
router.post('/api/fechas-especiales', FechaEspecialController.createFechaEspecial);

// Obtener todas las fechas especiales
router.get('/api/fechas-especiales', FechaEspecialController.getAllFechasEspeciales);

// Obtener una fecha especial por ID
router.get('/api/fechas-especiales/:id', FechaEspecialController.getFechaEspecialById);

// Actualizar una fecha especial por ID
router.put('/api/fechas-especiales/:id', FechaEspecialController.updateFechaEspecial);

// Eliminar una fecha especial por ID
router.delete('/api/fechas-especiales/:id', FechaEspecialController.deleteFechaEspecial);

export default router;
