import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Usuario from '../models/Usuario.js';

dotenv.config();

class LoginController {
  static async login(req, res) {
    try {
      const { correo_electronico_usuario, contrasena_usuario } = req.body;

      if (!correo_electronico_usuario || !contrasena_usuario) {
        return res.status(400).json({ message: 'Correo electrónico y contraseña son requeridos.' });
      }

      // Buscar el usuario por correo electrónico
      const usuario = await Usuario.findOne({ where: { correo_electronico_usuario } });
      if (!usuario) {
        return res.status(401).json({ message: 'Correo electrónico no encontrado.' });
      }

      // Verificar si el usuario está activo
      if (!usuario.estado_usuario) {
        return res.status(403).json({ message: 'Usuario inactivo.' });
      }

      // Comparar la contraseña proporcionada con el hash almacenado
      const esValido = await bcrypt.compare(contrasena_usuario, usuario.contrasena_usuario);
      if (!esValido) {
        return res.status(401).json({ message: 'Contraseña incorrecta.' });
      }

      // Generar el token JWT con el rol
      const token = jwt.sign(
        { documento: usuario.documento, rol: usuario.rol_usuario },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        token,
        usuario: {
          documento: usuario.documento,
          nombre_usuario: usuario.nombre_usuario,
          apellido_usuario: usuario.apellido_usuario,
          correo_electronico_usuario: usuario.correo_electronico_usuario,
          rol_usuario: usuario.rol_usuario,
          estado_usuario: usuario.estado_usuario,
        },
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      return res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message });
    }
  }
}

export default LoginController;