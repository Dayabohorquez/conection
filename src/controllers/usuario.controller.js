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
            const usuario = result[0]; // Accede solo al primer recordset, que contiene el usuario
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
                type: QueryTypes.RAW
            });
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            console.error('Error al crear el usuario:', error); // Agrega este log para ver el error en la consola
            res.status(500).json({ message: 'Error al crear el usuario', error });
        }
    }
    
    
    // Actualizar un usuario
    static async putUsuario(req, res) {
        const id = req.params.id;
        const { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario } = req.body;
        try {
            const [usuarioExistente] = await sequelize.query('CALL obtenerUsuarioPorId(:id)', { replacements: { id }, type: QueryTypes.RAW });

            if (usuarioExistente.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            await sequelize.query('CALL UpdateUsuario(:id, :nombre_usuario, :apellido_usuario, :celular_usuario, :correo_electronico_usuario, :usuario, :contrasena_usuario, :rol_usuario, :estado_usuario)', {
                replacements: { id, nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Usuario actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el usuario: ' + error.message });
        }
    }
    
    // Cambiar el estado de un usuario
    static async patchUsuarioEstado(req, res) {
        const id = req.params.id;
        const { estado_usuario } = req.body;
        try {
            if (estado_usuario === undefined) {
                return res.status(400).json({ message: 'El estado del usuario es requerido' });
            }

            await sequelize.query('CALL ToggleUsuarioState(:id, :estado_usuario)', {
                replacements: { id, estado_usuario },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Estado del usuario actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al cambiar el estado del usuario: ' + error.message });
        }
    }
    
    // Eliminar un usuario
    static async deleteUsuario(req, res) {
        const id = req.params.id;
        try {
            const [resultado] = await sequelize.query('CALL DeleteUsuario(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });

            if (resultado.affectedRows > 0) {
                res.status(204).send(); // 204 No Content
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el usuario: ' + error.message });
        }
    }
}

export default UsuarioController;
