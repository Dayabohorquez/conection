import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller.js';

const router = Router();

router.get('/api/usuario', UsuarioController.getUsuarios);
router.get('/api/usuario/:id', UsuarioController.getUsuarioById);
router.post('/api/usuario', UsuarioController.postUsuario);
router.put('/api/usuario/:id', UsuarioController.putUsuario);
router.patch('/api/usuario/:id', UsuarioController.patchUsuarioEstado);
router.delete('/api/usuario/:id', UsuarioController.deleteUsuario);

export default router;
