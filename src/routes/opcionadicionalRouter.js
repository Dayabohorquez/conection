import express from 'express';
import OpcionAdicionalController from '../controllers/OpcionesadicionalesController.js';

const router = express.Router();

// Obtener todas las opciones adicionales
router.get('/api/opciones-adicionales', OpcionAdicionalController.obtenerOpciones);

// Crear una nueva opción adicional
router.post('/api/opciones-adicionales', OpcionAdicionalController.crearOpcion);

// Actualizar una opción adicional por ID
router.put('/api/opciones-adicionales/:id_opcion', OpcionAdicionalController.actualizarOpcion);

// Eliminar una opción adicional por ID
router.delete('/api/opciones-adicionales/:id_opcion', OpcionAdicionalController.eliminarOpcion);

export default router;
