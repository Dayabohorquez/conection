import { Usuario } from '../models/Usuario.model.js';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios: ' + error });
    }
};

// Obtener un usuario por ID
export const getUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const usuario = await Usuario.findByPk(id);
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario: ' + error });
    }
};

// Crear un nuevo usuario
export const postUsuario = async (req, res) => {
    try {
        const { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario } = req.body;
        await Usuario.create({
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
};

// Actualizar un usuario
export const putUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario} = req.body;
        const [updated] = await Usuario.update({
            nombre_usuario,
            apellido_usuario,
            celular_usuario,
            correo_electronico_usuario,
            usuario,
            contrasena_usuario,
            rol_usuario,
        }, {
            where: { id_usuario: id }
        });
        if (updated) {
            res.status(200).json({ message: 'Usuario actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario: ' + error });
    }
};

// Actualizar parcialmente un usuario
export const patchUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Alternar el estado
        const nuevoEstado = usuario.estado_usuario === '1' ? '0' : '1';

        await Usuario.update(
            { estado_usuario: nuevoEstado },
            { where: { id_usuario: id } }
        );

        res.status(200).json({ message: 'Estado del usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del usuario: ' + error });
    }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const eliminado = await Usuario.destroy({
            where: { id_usuario: id }
        });

        if (eliminado) {
            res.status(204).send(); // 204 No Content, indica que la eliminación fue exitosa y no hay contenido que devolver
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario: ' + error });
    }
};
