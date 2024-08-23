import { Usuario } from '../models/Usuario.model.js';

class UsuarioController {
    // Obtener todos los usuarios
    static async getUsuarios(req, res) {
        try {
            const usuarios = await Usuario.getUsuarios();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los usuarios: ' + error });
        }
    }

    // Obtener un usuario por ID
    static async getUsuario(req, res) {
        try {
            const id = req.params.id;
            const usuario = await Usuario.getUsuarioById(id);
            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el usuario: ' + error });
        }
    }

    // Crear un nuevo usuario
    static async postUsuario(req, res) {
        try {
            const { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario } = req.body;
            await Usuario.createUsuario({
                nombre_usuario,
                apellido_usuario,
                celular_usuario,
                correo_electronico_usuario,
                usuario,
                contrasena_usuario,
                rol_usuario,
                estado_usuario
            });
            res.status(201).json({ message: 'Usuario creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el usuario: ' + error });
        }
    }

    // Actualizar un usuario
    static async putUsuario(req, res) {
        try {
            const id = req.params.id;
            const { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario } = req.body;
            
            // Obtener el usuario antes de hacer referencia a cualquier otro método.
            const usuarioExistente = await Usuario.getUsuarioById(id);

            if (!usuarioExistente) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            await Usuario.updateUsuario(id, {
                nombre_usuario,
                apellido_usuario,
                celular_usuario,
                correo_electronico_usuario,
                usuario,
                contrasena_usuario,
                rol_usuario,
                estado_usuario
            });
            res.status(200).json({ message: 'Usuario actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el usuario: ' + error });
        }
    }

    // Actualizar parcialmente un usuario
    static async patchUsuario(req, res) {
        try {
            const id = req.params.id;
            const usuario = await Usuario.getUsuarioById(id);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Alternar el estado
            const nuevoEstado = usuario.estado_usuario === '1' ? '0' : '1';

            await Usuario.updateUsuario(id, { estado_usuario: nuevoEstado });

            res.status(200).json({ message: 'Estado del usuario actualizado correctamente', estado: nuevoEstado });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el estado del usuario: ' + error });
        }
    }

    // Eliminar un usuario
    static async deleteUsuario(req, res) {
        try {
            const id = req.params.id;
            const eliminado = await Usuario.destroy({
                where: { id_usuario: id }
            });

            if (eliminado) {
                res.status(204).send(); // 204 No Content
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el usuario: ' + error });
        }
    }
}

export default UsuarioController;
