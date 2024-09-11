import Usuario from "../models/Usuario.js";

class UsuarioController {
  // Obtener todos los usuarios
  static async getUsuarios(req, res) {
    try {
      const usuarios = await Usuario.getUsuarios();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
  }

  // Obtener un usuario por ID
  static async getUsuarioById(req, res) {
    const { id } = req.params;
    try {
      const usuario = await Usuario.getUsuarioById(id);
      if (usuario.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(usuario[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuario', error });
    }
  }

  // Crear un nuevo usuario
  static async postUsuario(req, res) {
    const usuarioData = req.body;
    try {
      const message = await Usuario.createUsuario(usuarioData);
      res.status(201).json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear usuario', error });
    }
  }

  // Actualizar un usuario existente
  static async putUsuario(req, res) {
    const { id } = req.params;
    const {
      tipo_documento,
      documento,
      nombre_usuario,
      apellido_usuario,
      celular_usuario,
      correo_electronico_usuario,
      usuario,
      contrasena_usuario,
      direccion,
      fecha_registro,
      rol_usuario,
      estado_usuario
    } = req.body;

    try {
      const usuarioExistente = await Usuario.getUsuarioById(id);
      if (usuarioExistente.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const updatedData = {
        tipo_documento,
        documento,
        nombre_usuario,
        apellido_usuario,
        celular_usuario,
        correo_electronico_usuario,
        usuario,
        contrasena_usuario, // Si quieres actualizar la contraseña, asegúrate de encriptarla antes de enviarla
        direccion,
        fecha_registro,
        rol_usuario,
        estado_usuario
      };

      const message = await Usuario.updateUsuario(id, updatedData);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
  }

  // Cambiar el estado del usuario
  static async patchUsuarioEstado(req, res) {
    const { id } = req.params;
    try {
      const message = await Usuario.toggleUsuarioState(id);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar estado de usuario', error });
    }
  }

  // Obtener usuarios por rol
  static async getUsuariosByRol(req, res) {
    const { rol_usuario } = req.params;
    try {
      const usuarios = await Usuario.getUsuariosByRol(rol_usuario);
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios por rol', error });
    }
  }

  // Buscar usuario por correo electrónico
  static async getUsuarioByCorreo(req, res) {
    const { correo_electronico_usuario } = req.params;
    try {
      const usuario = await Usuario.getUsuarioByCorreo(correo_electronico_usuario);
      if (usuario.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(usuario[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar usuario por correo', error });
    }
  }

  // Comparar contraseñas para autenticación
  static async compararContrasena(req, res) {
    const { documento, contrasena_usuario } = req.body;
    try {
      const usuario = await Usuario.getUsuarioById(documento);
      if (usuario.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const esValido = await usuario[0].comparar(contrasena_usuario);
      if (esValido) {
        res.json({ message: 'Contraseña correcta' });
      } else {
        res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al comparar contraseñas', error });
    }
  }
}

export default UsuarioController;
