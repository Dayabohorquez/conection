import bcrypt from 'bcrypt';
import { Usuario } from "../models/Usuario.model.js";

class RegisterController {
    static async register(req, res) {
        try {
            const { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario } = req.body;

            // Validación de entrada
            if (!nombre_usuario || !apellido_usuario || !celular_usuario || !correo_electronico_usuario || !usuario || !contrasena_usuario || !rol_usuario) {
                return res.status(400).json({ message: "Todos los campos son requeridos." });
            }

            // Encriptar la contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(contrasena_usuario, 10);

            const newUser = {
                nombre_usuario,
                apellido_usuario,
                celular_usuario,
                correo_electronico_usuario,
                usuario,
                contrasena_usuario: hashedPassword, // Guardar la contraseña encriptada
                rol_usuario,
                estado_usuario: '1' // Estado inicial del usuario
            };

            // Guardar el nuevo usuario en la base de datos
            const usuarioCreado = await Usuario.createUsuario(newUser);
            return res.status(201).json({ message: "Usuario registrado exitosamente", usuario: usuarioCreado });

        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            return res.status(500).json({ message: "Error al registrar el usuario. Por favor, intenta nuevamente más tarde." });
        }
    }
}

export default RegisterController;
