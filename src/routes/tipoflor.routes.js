import { Router } from 'express';
import TipoFlorController from '../controllers/tipoFlor.controller.js';

// Inicializamos el enrutador
const router = Router();

// Obtener todos los tipos de flores
router.get('/api/tipos-flor', TipoFlorController.getTiposFlor);

// Obtener un tipo de flor por ID
router.get('/api/tipo-flor/:id', TipoFlorController.getTipoFlorById);

// Crear un nuevo tipo de flor
router.post('/api/tipo-flor', TipoFlorController.createTipoFlor);

// Actualizar un tipo de flor existente
router.put('/api/tipo-flor/:id', TipoFlorController.updateTipoFlor);

// Eliminar un tipo de flor
router.delete('/api/tipo-flor/:id', TipoFlorController.deleteTipoFlor);

export default router;
