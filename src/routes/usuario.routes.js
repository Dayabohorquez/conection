import { Router } from 'express';
import { getUsuarios, getUsuario, postUsuario, putUsuario, patchUsuario, deleteUsuario } from '../controllers/usuario.controller.js';

const router = Router();

router.get('/usuario', getUsuarios);
router.get('/usuario/:id', getUsuario);
router.post('/usuario', postUsuario);
router.put('/usuario/:id', putUsuario);
router.patch('/usuario/:id', patchUsuario);
router.delete('/usuario/:id', deleteUsuario);

export default router;
