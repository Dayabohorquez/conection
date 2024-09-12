import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";

class UsuarioController {
  // Obtener todos los usuarios
  // Obtener todos los usuarios
static async getUsuarios(req, res) {
  try {
      const usuarios = await Usuario.getUsuarios();
      const usuariosArray = Object.values(usuarios);
      console.log('Usuarios obtenidos:', usuariosArray);
      if (!Array.isArray(usuariosArray) || usuariosArray.length === 0) {
          return res.status(404).json({ message: 'No se encontraron usuarios' });
      }
      res.json(usuariosArray); // Devuelve todos los usuarios
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
}

// Obtener un usuario por ID
static async getUsuarioById(req, res) {
  const { documento } = req.params; // Obtén el documento de los parámetros de la solicitud
  console.log(`Buscando usuario con documento: ${documento}`); // Añade log para depuración

  try {
    const usuario = await Usuario.getUsuarioById(documento); // Obtén el usuario por documento

    // Imprime el resultado para depuración
    console.log('Resultado de getUsuarioById:', usuario);

    // Verifica si el usuario es null o no
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Devuelve el usuario encontrado
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

  static async putUsuario(req, res) {
    const { documento } = req.params; // Cambiado de id a documento
    const {
      tipo_documento,
      nombre_usuario,
      apellido_usuario,
      correo_electronico_usuario,
      contrasena_usuario,
      direccion,
      fecha_registro,
      rol_usuario,
      estado_usuario
    } = req.body;

    try {
      console.log('Buscando usuario con documento:', documento);
      const usuarioExistente = await Usuario.getUsuarioById(documento); // Verifica si el usuario existe por documento

      if (!usuarioExistente || usuarioExistente.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const updatedData = {
        tipo_documento,
        nombre_usuario,
        apellido_usuario,
        correo_electronico_usuario,
        direccion,
        fecha_registro,
        rol_usuario,
        estado_usuario
      };

      // Solo encriptar la contraseña si está presente en el cuerpo de la solicitud
      if (contrasena_usuario) {
        updatedData.contrasena_usuario = await bcrypt.hash(contrasena_usuario, 10);
      }

      console.log('Actualizando usuario con datos:', updatedData);
      const message = await Usuario.updateUsuario(documento, updatedData); // Usa documento en lugar de id
      res.json({ message });
    } catch (error) {
      console.error('Error al actualizar usuario:', error); // Agregar más detalles en el log
      res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
  }

  // Cambiar el estado del usuario
  static async patchUsuarioEstado(req, res) {
    const { documento } = req.params; // Asegúrate de que estás extrayendo 'documento' correctamente
    try {
      const message = await Usuario.toggleUsuarioState(documento); // Pasa 'documento' a la función
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
