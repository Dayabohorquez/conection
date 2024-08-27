// src/controllers/usuario.controller.js
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class UsuarioController {
    // Obtener todos los usuarios
    static async getUsuarios(req, res) {
        try {
            const usuarios = await sequelize.query('CALL GetUsuarios()', { type: QueryTypes.RAW });
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener usuarios', error });
        }
    }

    static async getUsuarioById(req, res) {
        const { id } = req.params;
        try {
            const result = await sequelize.query('CALL GetUsuarioById(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });
            const usuario = result[0];
            if (usuario) {
                res.json(usuario);
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el usuario', error });
        }
    } 
    
    // Crear un nuevo usuario
    static async postUsuario(req, res) {
        const { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario } = req.body;
        try {
            await sequelize.query('CALL CreateUsuario(:nombre_usuario, :apellido_usuario, :celular_usuario, :correo_electronico_usuario, :usuario, :contrasena_usuario, :rol_usuario, :estado_usuario)', {
                replacements: { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario },
                type: QueryTypes.RAW,
            });
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            res.status(500).json({ message: 'Error al crear el usuario', error });
        }
    }
    
    // Actualizar un usuario
    static async putUsuario(req, res) {
        const id = req.params.id;
        const { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario } = req.body;
        try {
        
            await sequelize.query('CALL UpdateUsuario(:id, :nombre_usuario, :apellido_usuario, :celular_usuario, :correo_electronico_usuario, :usuario, :contrasena_usuario, :rol_usuario, :estado_usuario)', {
                replacements: { id, nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Usuario actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el usuario: ' + error.message });
        }
    }
    
    static async patchUsuarioEstado(req, res) {
        const id = req.params.id;
    
        try {

            const resultado = await sequelize.query('CALL ToggleUsuarioState(:usuario_id)', {
                replacements: { usuario_id: id },
                type: QueryTypes.SELECT
            });

            if (Array.isArray(resultado) && resultado.length > 0) {
                const estadoActualizado = resultado[0][0]?.estado_despues;
    
                if (estadoActualizado !== undefined) {
                    res.status(200).json({ message: 'Estado del usuario actualizado correctamente', estadoActualizado });
                } else {
                    res.status(500).json({ message: 'El estado del usuario no se pudo obtener' });
                }
            } else {
                res.status(500).json({ message: 'Error al procesar la consulta' });
            }
        } catch (error) {
            console.error('Error al cambiar el estado del usuario:', error.message);
            res.status(500).json({ message: 'Error al cambiar el estado del usuario: ' + error.message });
        }
    }
    
    // Eliminar un usuario
    static async deleteUsuario(req, res) {
        const id = req.params.id;
        try {
            await sequelize.query('CALL DeleteUsuario(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el usuario: ' + error.message });
        }
    }
}

export default UsuarioController;