import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller.js';

const router = Router();

// Obtener todos los usuarios
router.get('/api/usuarios', UsuarioController.getUsuarios);

// Obtener un usuario por ID
router.get('/api/usuario/:id', UsuarioController.getUsuarioById);

// Crear un nuevo usuario
router.post('/api/usuario', UsuarioController.postUsuario);

// Actualizar un usuario existente
router.put('/api/usuario/:id', UsuarioController.putUsuario);

// Cambiar el estado del usuario
router.patch('/api/usuario/:id/estado', UsuarioController.patchUsuarioEstado);

// Obtener usuarios por rol
router.get('/api/usuarios/rol/:rol_usuario', UsuarioController.getUsuariosByRol);

// Buscar usuario por correo electrónico
router.get('/api/usuario/correo/:correo_electronico_usuario', UsuarioController.getUsuarioByCorreo);

// Comparar contraseñas para autenticación
router.post('/api/usuario/comparar-contrasena', UsuarioController.compararContrasena);

export default router;
