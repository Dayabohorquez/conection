import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller.js';
import RegisterController from '../controllers/register.controller.js';
import LoginController from '../controllers/login.controller.js';

const router = Router();

router.get('/api/usuario', UsuarioController.getUsuarios);
router.get('/api/usuario/:id', UsuarioController.getUsuarioById);
router.post('/api/usuario', UsuarioController.postUsuario);
router.put('/api/usuario/:id', UsuarioController.putUsuario);
router.patch('/api/usuario/:id', UsuarioController.patchUsuarioEstado);
router.delete('/api/usuario/:id', UsuarioController.deleteUsuario);
router.post('/api/register', RegisterController.register);
router.post('/api/login', LoginController.login);

export default router;
