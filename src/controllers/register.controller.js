import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';

class RegisterController {
  static async register(req, res) {
    try {
      const { documento, nombre_usuario, apellido_usuario, correo_electronico_usuario, contrasena_usuario } = req.body;

      // Verificar que todos los campos requeridos están presentes
      if (!documento || !nombre_usuario || !apellido_usuario || !correo_electronico_usuario || !contrasena_usuario) {
        return res.status(400).json({ message: "Todos los campos son requeridos." });
      }

      // Buscar si el correo electrónico o el documento ya están registrados
      const existingEmail = await Usuario.findOne({ where: { correo_electronico_usuario } });
      const existingDocumento = await Usuario.findOne({ where: { documento } });

      if (existingEmail) {
        return res.status(400).json({ message: "El correo electrónico ya está registrado." });
      }

      if (existingDocumento) {
        return res.status(400).json({ message: "El documento ya está registrado." });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(contrasena_usuario, 10);
      // console.log("Contraseña encriptada:", hashedPassword); // Opcional

      // Crear un nuevo usuario
      await Usuario.create({
        documento,
        nombre_usuario,
        apellido_usuario,
        correo_electronico_usuario,
        contrasena_usuario: hashedPassword,
        estado_usuario: true
      });

      // Responder con éxito
      return res.status(201).json({ message: "Usuario registrado exitosamente" });

    } catch (error) {
      console.error("Error al registrar el usuario:", error.message);
      return res.status(500).json({ message: "Error al registrar el usuario. Por favor, intenta nuevamente más tarde." });
    }
  }
}

export default RegisterController;
