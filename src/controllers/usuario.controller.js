import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import { sendEmail } from '../utils/email.js'; // Asegúrate de importar la función de envío de correo

class UsuarioController {
  // Obtener todos los usuarios
  static async getUsuarios(req, res) {
    try {
      const usuarios = await Usuario.getUsuarios();
      console.log('Usuarios obtenidos:', usuarios);
      if (!Array.isArray(usuarios) || usuarios.length === 0) {
        return res.status(404).json({ message: 'No se encontraron usuarios' });
      }
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
  }

  // Obtener un usuario por documento
  static async getUsuarioById(req, res) {
    const { documento } = req.params;
    console.log(`Buscando usuario con documento: ${documento}`);

    try {
      const usuario = await Usuario.findOne({ where: { documento } });
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

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Por favor, proporciona ambas contraseñas.' });
    }

    try {
      const usuario = await Usuario.getUsuarioById(documento);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      const esValido = await bcrypt.compare(oldPassword, usuario.contrasena_usuario);
      if (!esValido) {
        return res.status(400).json({ message: 'Contraseña antigua incorrecta.' });
      }

      const updateResult = await Usuario.updatePassword(documento, newPassword);
      if (!updateResult.success) {
        return res.status(500).json({ message: 'No se pudo actualizar la contraseña.' });
      }

      res.json({ message: 'Contraseña cambiada exitosamente.' });
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      return res.status(500).json({ message: 'Error al cambiar la contraseña.', error: error.message });
    }
  }

  static async agregarDireccion(req, res) {
    const { documento } = req.params; // Documento del usuario
    const { direccion } = req.body; // Dirección que envía el frontend

    try {
      // Llama al método del modelo para agregar la dirección
      await Usuario.agregarDireccion(documento, direccion); // Asegúrate de que 'direccion' no sea undefined

      res.status(200).json({ message: 'Dirección agregada exitosamente' });
    } catch (error) {
      console.error('Error al agregar la dirección:', error);
      res.status(500).json({ message: 'Error al agregar la dirección', error: error.message });
    }
  }

  static async obtenerDireccionPorDocumento(req, res) {
    const { documento } = req.params;

    try {
      // Aquí iría la lógica para obtener la dirección de la base de datos
      const direccion = await Usuario.findOne({ where: { documento } }); // Asegúrate de que este modelo esté correctamente definido

      if (!direccion) {
        return res.status(404).json({ mensaje: 'Dirección no encontrada' });
      }

      res.json(direccion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener la dirección' });
    }
  }
  static async changePassword(req, res) {
    const { documento } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Validar las contraseñas
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Por favor, proporciona ambas contraseñas.' });
    }

    try {
      // Obtener el usuario de la base de datos
      const usuario = await Usuario.findByPk(documento); // Asegúrate de usar el método correcto para obtener el usuario
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      // Verificar si la contraseña antigua es válida
      const esValido = await bcrypt.compare(oldPassword, usuario.contrasena_usuario);
      if (!esValido) {
        return res.status(400).json({ message: 'Contraseña antigua incorrecta.' });
      }

      // Actualizar la contraseña con la nueva
      const updateResult = await Usuario.updatePassword(documento, newPassword);
      if (!updateResult.success) {
        return res.status(500).json({ message: 'No se pudo actualizar la contraseña.' });
      }

      // Respuesta exitosa
      res.json({ message: 'Contraseña cambiada exitosamente.' });
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      return res.status(500).json({ message: 'Error al cambiar la contraseña.', error: error.message });
    }
  }

  // Comparar la contraseña
  static async compararContrasena(req, res) {
    console.log('Datos recibidos:', req.body);
    const { documento, contrasena_usuario } = req.body;

    // Validar los parámetros de entrada
    if (!documento || !contrasena_usuario) {
      return res.status(400).json({ message: 'El documento y la contraseña son requeridos.' });
    }

    try {
      // Obtener el usuario de la base de datos
      const usuario = await Usuario.findByPk(documento); // Usamos findByPk si 'documento' es la clave primaria
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Comparar la contraseña proporcionada con la almacenada
      const esValido = await bcrypt.compare(contrasena_usuario, usuario.contrasena_usuario);
      if (esValido) {
        return res.json({ message: 'Contraseña correcta' });
      } else {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    } catch (error) {
      console.error('Error al comparar contraseñas:', error);
      return res.status(500).json({ message: 'Error al comparar contraseñas', error: error.message });
    }
  }

  // Solicitar restablecimiento de contraseña
  static async solicitarRestablecimientoContrasena(req, res) {
    const { correo_electronico_usuario } = req.body;

    if (!correo_electronico_usuario) {
      return res.status(400).json({ message: 'El correo electrónico es requerido.' });
    }

    try {
      const usuario = await Usuario.getUsuarioById(correo_electronico_usuario);

      if (!usuario) {
        return res.status(404).json({ message: 'Correo electrónico no encontrado.' });
      }

      const tokenData = await Usuario.solicitarRestablecimientoContrasena(correo_electronico_usuario);

      // Enviar correo utilizando la función sendEmail
      await sendEmail(
        correo_electronico_usuario,
        'Restablecimiento de contraseña',
        `Aquí está tu token de restablecimiento: ${tokenData.token}`
      );

      return res.status(200).json({ message: 'Se ha enviado un correo para restablecer la contraseña.' });
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      return res.status(500).json({ message: 'Error al solicitar restablecimiento de contraseña', error });
    }
  }

  // Validar token
  static async validarToken(req, res) {
    const { token } = req.params;

    try {
      const response = await Usuario.validarToken(token);
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: 'Error al validar el token', error });
    }
  }

  // Actualizar contraseña
  static async actualizarContrasena(req, res) {
    const { token } = req.params;
    const { nueva_contrasena } = req.body;

    if (!nueva_contrasena) {
      return res.status(400).json({ message: 'La nueva contraseña es requerida.' });
    }

    try {
      const response = await Usuario.actualizarContrasena(token, nueva_contrasena);
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la contraseña', error });
    }
  }
}

export default UsuarioController;
