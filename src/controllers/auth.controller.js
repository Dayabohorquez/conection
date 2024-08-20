import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.model.js';

const saltRounds = 10;
const JWT_SECRET = '1234.a'; // Cambia esto por una clave secreta segura

export const handleAuth = async (req, res) => {
    const { action, nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario } = req.body;

    if (action === 'register') {
        try {
            const hashedPassword = await bcrypt.hash(contrasena_usuario, saltRounds);
            const newUser = await Usuario.create({
                nombre_usuario,
                apellido_usuario,
                celular_usuario,
                correo_electronico_usuario,
                usuario,
                contrasena_usuario: hashedPassword,
                rol_usuario,
                estado_usuario
            });
            res.status(201).json({ message: 'Usuario registrado correctamente', user: newUser });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar el usuario: ' + error });
        }
    } else if (action === 'login') {
        try {
            const user = await Usuario.findOne({ where: { usuario } });
            if (!user) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }
            const isMatch = await bcrypt.compare(contrasena_usuario, user.contrasena_usuario);
            if (!isMatch) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
            const token = jwt.sign({ id_usuario: user.id_usuario, rol_usuario: user.rol_usuario }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Inicio de sesión exitoso', token });
        } catch (error) {
            res.status(500).json({ message: 'Error al iniciar sesión: ' + error });
        }
    } else {
        res.status(400).json({ message: 'Acción no válida' });
    }
};
