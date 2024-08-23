import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller.js';

const router = Router();

router.get('/usuario', UsuarioController.getUsuarios);
router.get('/usuario/:id', UsuarioController.getUsuario);
router.post('/usuario', UsuarioController.postUsuario);
router.put('/usuario/:id', UsuarioController.putUsuario);
router.patch('/usuario/:id', UsuarioController.patchUsuario);
router.delete('/usuario/:id', UsuarioController.deleteUsuario);

export default router;
