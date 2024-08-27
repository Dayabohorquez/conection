import {Usuario} from "../models/Usuario.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class LoginController {
    static async login(req, res) {
        try {
            const { email, pass } = req.body;
            const usuario = await Usuario.findOne({ where: { correo_electronico_usuario: email }});

            if (usuario) {
                const isMatch = await usuario.comparar(pass);
                if (isMatch) {
                    const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, {
                        expiresIn: "1h",
                    });

                    return res.status(201).json({
                        message: "Inicio de sesión exitoso",
                        token,
                        Usuario: {
                            id_usuario: usuario.id_usuario,
                            nombre_usuario: usuario.nombre_usuario,
                            apellido_usuario: usuario.apellido_usuario,
                            celular_usuario: usuario.celular_usuario,
                            correo_electronico_usuario: usuario.correo_electronico_usuario,
                            usuario: usuario.usuario,
                            rol_usuario: usuario.rol_usuario,
                            estado_usuario: usuario.estado_usuario,
                        },
                    });
                } else {
                    return res.status(401).json({ message: "Verifica tu contraseña" });
                }
            } else {
                return res.status(401).json({ message: "Verifica tu correo" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error al iniciar sesión: " + error });
        }
    }
}

export default LoginController;