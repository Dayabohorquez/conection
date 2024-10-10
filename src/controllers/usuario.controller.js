import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";

class UsuarioController {
  // Obtener todos los usuarios
  static async getUsuarios(req, res) {
    try {
      const usuarios = await Usuario.getUsuarios();
      const usuariosArray = Object.values(usuarios);
      console.log('Usuarios obtenidos:', usuariosArray);
      if (!Array.isArray(usuariosArray) || usuariosArray.length === 0) {
        return res.status(404).json({ message: 'No se encontraron usuarios' });
      }
      res.json(usuariosArray);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
  }

  // Obtener un usuario por documento
  static async getUsuarioById(req, res) {
    const { documento } = req.params;
    console.log(`Buscando usuario con documento: ${documento}`);

    try {
      const usuario = await Usuario.getUsuarioById(documento);
      console.log('Resultado de getUsuarioById:', usuario);

      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json(usuario);
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

  // Actualizar un usuario
  static async putUsuario(req, res) {
    const { documento } = req.params;
    const {
      nombre_usuario,
      apellido_usuario,
      correo_electronico_usuario,
      direccion,
    } = req.body;

    try {
      console.log('Datos recibidos:', req.body);
      console.log('Buscando usuario con documento:', documento);
      const usuarioExistente = await Usuario.getUsuarioById(documento);

      if (!usuarioExistente) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const updatedData = {
        nombre_usuario,
        apellido_usuario,
        correo_electronico_usuario,
        direccion,
      };

      console.log('Actualizando usuario con datos:', updatedData);

      const message = await Usuario.updateUsuario(documento, updatedData);
      res.json({ message });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error al actualizar usuario', error: error.message || error });
    }
  }

  // Cambiar el estado del usuario
  static async patchUsuarioEstado(req, res) {
    const { documento } = req.params;
    try {
      const message = await Usuario.toggleUsuarioState(documento);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar estado de usuario', error });
    }
  }

  // Actualizar el rol de un usuario
  static async putRolUsuario(req, res) {
    const { documento } = req.params;
    const { rol_usuario } = req.body;

    try {
      console.log('Datos recibidos para actualizar rol:', req.body);
      console.log('Buscando usuario con documento:', documento);

      // Validar el rol permitido
      const rolesPermitidos = ['Vendedor', 'Domiciliario', 'Administrador', 'Cliente'];
      if (!rolesPermitidos.includes(rol_usuario)) {
        return res.status(400).json({ message: 'Rol no permitido.' });
      }

      const message = await Usuario.updateRolUsuario(documento, rol_usuario);
      res.json(message);
    } catch (error) {
      console.error('Error al actualizar rol de usuario:', error);
      res.status(500).json({ message: 'Error al actualizar rol de usuario', error: error.message || error });
    }
  }

  // Cambiar la contraseña
  static async changePassword(req, res) {
    const { documento } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Validar que ambas contraseñas se proporcionen
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Por favor, proporciona ambas contraseñas.' });
    }

    try {
      // Obtener el usuario por documento
      const usuario = await Usuario.getUsuarioById(documento);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Comparar la contraseña antigua
      const esValido = await bcrypt.compare(oldPassword, usuario.contrasena_usuario);
      if (!esValido) {
        return res.status(400).json({ message: 'Contraseña antigua incorrecta' });
      }

      // Hashear la nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña en la base de datos
      await Usuario.updatePassword(documento, hashedNewPassword);

      res.json({ message: 'Contraseña cambiada exitosamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al cambiar la contraseña', error });
    }
  }

  // Comparar contraseña
  static async compararContrasena(req, res) {
    console.log('Datos recibidos:', req.body); // Agregar esta línea
    const { documento, contrasena_usuario } = req.body;

    if (!documento || !contrasena_usuario) {
      return res.status(400).json({ message: 'El documento y la contraseña son requeridos.' });
    }

    try {
      const usuario = await Usuario.getUsuarioById(documento);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const esValido = await bcrypt.compare(contrasena_usuario, usuario.contrasena_usuario);
      if (esValido) {
        return res.json({ message: 'Contraseña correcta' });
      } else {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error al comparar contraseñas', error });
    }
  }

}

export default UsuarioController;
