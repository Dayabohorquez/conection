import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Usuario from '../models/Usuario.js';

dotenv.config();

class LoginController {
  static async login(req, res) {
    try {
      const { correo_electronico_usuario, contrasena_usuario } = req.body;

      // Validar entrada
      if (!correo_electronico_usuario || !contrasena_usuario) {
        return res.status(400).json({ message: 'Correo electrónico y contraseña son requeridos.' });
      }

      const usuario = await Usuario.findOne({ where: { correo_electronico_usuario } });
      if (!usuario) {
        return res.status(401).json({ message: 'Correo electrónico no encontrado' });
      }

      // Verificar si el usuario está activo
      if (!usuario.estado_usuario) {
        return res.status(403).json({ message: 'Usuario inactivo. Comuníquese con el administrador.' });
      }

      // Comparar contraseñas
      const isMatch = await bcrypt.compare(contrasena_usuario, usuario.contrasena_usuario);
      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Generar token
      const token = jwt.sign(
        { documento: usuario.documento, rol: usuario.rol_usuario },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      return res.status(500).json({ message: 'Error al iniciar sesión.' });
    }
  }
}

export default LoginController;
