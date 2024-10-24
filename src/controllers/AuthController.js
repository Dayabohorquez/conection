import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Usuario from '../models/Usuario.js';

class AuthController {
    static async requestPasswordReset(req, res) {
        try {
            const { correo_electronico_usuario } = req.body;

            console.log('Correo electrónico recibido:', correo_electronico_usuario);

            // Verificar si el usuario existe
            const usuario = await Usuario.findOne({ where: { correo_electronico_usuario } });
            if (!usuario) {
                console.log('Usuario no encontrado');
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Generar un token y fecha de expiración
            const token = crypto.randomBytes(32).toString('hex');
            const tokenExpiration = new Date(Date.now() + 3600000); // 1 hora desde ahora

            console.log('Token generado:', token);

            // Guardar el token y su fecha de expiración en la base de datos
            usuario.reset_token = token;
            usuario.reset_token_expiration = tokenExpiration;
            await usuario.save();

            // Configuración del transporte de correo con nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                tls: {
                    rejectUnauthorized: false, // Desactiva la validación de certificados
                },
            });

            console.log('Transporte de correo configurado correctamente');

            // Enviar el correo electrónico
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: usuario.correo_electronico_usuario,
                subject: 'Restablecer contraseña',
                text: `Haga clic en el siguiente enlace para restablecer su contraseña: http://localhost:4000/reset-password/${token}`,
            };

            await transporter.sendMail(mailOptions);

            console.log('Correo electrónico enviado correctamente');
            res.status(200).json({ message: 'Correo de restablecimiento de contraseña enviado' });
        } catch (error) {
            console.error('Error en la solicitud de restablecimiento:', error.message);
            res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { token, nueva_contrasena } = req.body;

            console.log('Token recibido:', token);

            // Buscar al usuario con el token y verificar si no ha expirado
            const usuario = await Usuario.findOne({
                where: {
                    reset_token: token,
                    reset_token_expiration: { [Op.gt]: Date.now() }, // Verifica que el token no ha expirado
                },
            });

            if (!usuario) {
                console.log('Token inválido o expirado');
                return res.status(400).json({ message: 'Token inválido o expirado' });
            }

            // Actualizar la contraseña del usuario
            const hash = await bcrypt.hash(nueva_contrasena, 10);
            usuario.contrasena_usuario = hash;
            usuario.reset_token = null; // Eliminar el token
            usuario.reset_token_expiration = null; // Eliminar la expiración

            await usuario.save();

            console.log('Contraseña actualizada correctamente');
            res.status(200).json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            console.error('Error al restablecer contraseña:', error.message);
            res.status(500).json({ message: 'Error al restablecer la contraseña', error: error.message });
        }
    }
}

export default AuthController;
