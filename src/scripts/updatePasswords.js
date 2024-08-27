import { Usuario } from "../models/Usuario.model.js";
import bcrypt from 'bcrypt';

async function updatePasswords() {
    try {
        const usuarios = await Usuario.findAll();

        for (const usuario of usuarios) {
            if (!usuario.contrasena_usuario.startsWith('$2b$')) { // Verifica si ya está encriptada
                const hashedPassword = await bcrypt.hash(usuario.contrasena_usuario, 10);
                await usuario.update({ contrasena_usuario: hashedPassword });
                console.log(`Contraseña actualizada para el usuario con id ${usuario.id_usuario}`);
            }
        }
    } catch (error) {
        console.error("Error al actualizar contraseñas:", error);
    }
}

updatePasswords();
