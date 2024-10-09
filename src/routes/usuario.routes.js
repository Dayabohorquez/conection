import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller.js';
import RegisterController from '../controllers/register.controller.js';
import LoginController from '../controllers/login.controller.js';


const router = Router();

// Obtener todos los usuarios
router.get('/api/usuarios', UsuarioController.getUsuarios);

// Obtener un usuario por ID
router.get('/api/usuario/:documento', UsuarioController.getUsuarioById);

// Crear un nuevo usuario
router.post('/api/usuario', UsuarioController.postUsuario);

// Actualizar un usuario existente
router.put('/api/usuario/:documento', UsuarioController.putUsuario);

router.put('/api/usuarios/:documento/rol', UsuarioController.putRolUsuario);

// Cambiar el estado del usuario
router.patch('/api/usuario/:documento/estado', UsuarioController.patchUsuarioEstado);

router.post('/api/register', RegisterController.register); 
router.post('/api/login', LoginController.login);


export default router;
