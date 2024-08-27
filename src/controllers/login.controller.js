import { Usuario } from "../models/Usuario.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from 'bcrypt'

dotenv.config();

class LoginController {
    static async login(req, res) {
        try {
            const { correo_electronico_usuario, contrasena_usuario } = req.body;
            const user = await Usuario.findOne({ where: { correo_electronico_usuario } });

            if (user) {
                const isMatch = await bcrypt.compare(contrasena_usuario, user.contrasena_usuario);
                console.log('¿Las contraseñas coinciden?:', isMatch); // Usando el método de instancia
                if (isMatch) {
                    const token = jwt.sign({ id: user.id_usuario }, process.env.JWT_SECRET, {
                        expiresIn: "1h",
                    });

                    return res.status(201).json({
                        message: "Inicio de sesión exitoso",
                        token,
                        user: {
                            id: user.id_usuario,
                        },
                    });
                } else {
                    return res.status(401).json({ message: "Verifica tu contraseña" });
                }
            } else {
                return res.status(401).json({ message: "Verifica tus correo" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error al iniciar sesión: " + error });
        }
    }
}

export default LoginController;
