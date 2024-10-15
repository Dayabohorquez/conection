import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller.js';
import RegisterController from '../controllers/register.controller.js';
import LoginController from '../controllers/login.controller.js';

const router = Router();

// Obtener todos los usuarios
router.get('/api/usuarios', UsuarioController.getUsuarios);

// Obtener un usuario por documento
router.get('/api/usuario/:documento', UsuarioController.getUsuarioById);

// Crear un nuevo usuario
router.post('/api/usuario', UsuarioController.postUsuario);

// Actualizar un usuario existente
router.put('/api/usuario/:documento', UsuarioController.putUsuario);

// Actualizar el rol de un usuario
router.put('/api/usuario/:documento/rol', UsuarioController.putRolUsuario);

// Cambiar el estado del usuario
router.patch('/api/usuario/:documento/estado', UsuarioController.patchUsuarioEstado);

// Cambiar la contraseña del usuario
router.patch('/api/usuarios/:documento/cambiar-contrasena', UsuarioController.changePassword);

// Comparar la contraseña del usuario
router.post('/api/usuario/comparar-contrasena', UsuarioController.compararContrasena);

// Solicitar restablecimiento de contraseña
router.post('/api/usuario/solicitar-restablecimiento', UsuarioController.solicitarRestablecimientoContrasena);

// Validar token de recuperación
router.get('/api/usuario/validar-token/:token', UsuarioController.validarToken);

// Actualizar la contraseña usando el token
router.patch('/api/usuario/actualizar-contrasena/:token', UsuarioController.actualizarContrasena);

// Registro de usuario
router.post('/api/register', RegisterController.register);

// Inicio de sesión
router.post('/api/login', LoginController.login);

export default router;
