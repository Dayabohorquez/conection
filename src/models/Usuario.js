import bcrypt from 'bcrypt';
import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class Usuario extends Model {
  // Método para crear un usuario
  static async createUsuario(usuario) {
    try {
      const claveEncriptada = await bcrypt.hash(usuario.contrasena_usuario, 10);
      usuario.contrasena_usuario = claveEncriptada;

      await sequelize.query(
        'CALL CrearUsuario(:nombre_usuario, :apellido_usuario, :correo_electronico_usuario, :contrasena_usuario, :direccion, :estado_usuario)',
        {
          replacements: {
            nombre_usuario: usuario.nombre_usuario,
            apellido_usuario: usuario.apellido_usuario,
            correo_electronico_usuario: usuario.correo_electronico_usuario,
            contrasena_usuario: usuario.contrasena_usuario,
            direccion: usuario.direccion,
            estado_usuario: usuario.estado_usuario,
          },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Usuario creado exitosamente' };
    } catch (error) {
      console.error(`Unable to create usuario: ${error}`);
      throw error;
    }
  }

  // Método para obtener todos los usuarios
  static async getUsuarios() {
    try {
      const usuarios = await sequelize.query('CALL ObtenerUsuarios()', { type: QueryTypes.RAW });
      return usuarios;
    } catch (error) {
      console.error(`Unable to find all usuarios: ${error}`);
      throw error;
    }
  }

  // Método para obtener un usuario por documento
  static async getUsuarioById(documento) {
    try {
      const result = await sequelize.query(
        'CALL ObtenerUsuarioPorId(:documento)',
        {
          replacements: { documento }, // Asegúrate de que `documento` esté aquí
          type: QueryTypes.RAW
        }
      );
      return result.length > 0 ? Usuario.build(result[0]) : null;
    } catch (error) {
      console.error(`Unable to find usuario by documento: ${error}`);
      throw error;
    }
  }

  // Método para actualizar un usuario
  static async updateUsuario(documento, updated_usuario) {
    try {
      await sequelize.query(
        'CALL ActualizarUsuario(:documento, :nombre_usuario, :apellido_usuario, :correo_electronico_usuario, :direccion)',
        {
          replacements: {
            documento,
            nombre_usuario: updated_usuario.nombre_usuario,
            apellido_usuario: updated_usuario.apellido_usuario,
            correo_electronico_usuario: updated_usuario.correo_electronico_usuario,
            direccion: updated_usuario.direccion
          },
          type: QueryTypes.RAW,
        }
      );
      return { message: 'Usuario actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update usuario: ${error}`);
      throw error;
    }
  }

  // Método para editar el rol de un usuario
  static async updateRolUsuario(documento, nuevo_rol) {
    try {
      const sql = 'CALL EditarRolUsuario(:documento, :nuevo_rol)';
      await sequelize.query(sql, {
        replacements: { documento, nuevo_rol },
        type: QueryTypes.RAW,
      });
      return { message: 'Rol actualizado exitosamente' };
    } catch (error) {
      if (error.original && error.original.sqlState === '45000') {
        throw new Error('Rol no permitido.');
      }
      console.error(`Unable to update rol usuario: ${error}`);
      throw error;
    }
  }

  static async agregarDireccion(documento, direccion) {
    try {
      // Verifica que los valores sean correctos
      console.log('Documento:', documento);
      console.log('Dirección:', direccion);

      await sequelize.query('CALL UpdateDireccionUsuario(:documento, :direccion)', {
        replacements: {
          documento: parseInt(documento, 10), // Convierte a entero si es necesario
          direccion: direccion // Asegúrate de que esto tenga el valor correcto
        },
        type: sequelize.QueryTypes.RAW
      });
    } catch (error) {
      throw new Error('Error al agregar la dirección del usuario: ' + error.message);
    }
  }

  // Método para cambiar el estado de un usuario
  static async toggleUsuarioState(documento) {
    try {
      await sequelize.query('CALL CambiarEstadoUsuario(:documento)', {
        replacements: { documento },
        type: QueryTypes.RAW
      });
      return { message: 'Estado de usuario actualizado' };
    } catch (error) {
      console.error(`Unable to toggle usuario state: ${error}`);
      throw error;
    }
  }

  // Método para buscar usuario por correo
  static async buscarUsuarioPorCorreo(correo) {
    try {
      const result = await sequelize.query('CALL BuscarUsuarioPorCorreo(:correo)', {
        replacements: { correo },
        type: QueryTypes.RAW
      });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error(`Error al buscar usuario por correo: ${error}`);
      throw error;
    }
  }

  static async updatePassword(documento, newPassword) {
    try {
      // Encriptar la nueva contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log('Nuevo hash de contraseña:', hashedPassword); // Para depuración

      // Actualizar la contraseña en la base de datos
      const result = await Usuario.update(
        { contrasena_usuario: hashedPassword },
        { where: { documento } }
      );

      // Verificar si el usuario fue encontrado y actualizado
      if (result[0] === 0) {
        throw new Error('No se encontró el usuario o la contraseña no se actualizó.');
      }

      return { success: true, message: 'Contraseña actualizada con éxito.' };
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      return { success: false, message: error.message };
    }
  }

  // Método de instancia para comparar contraseñas
  async comparar(contrasena_usuario) {
    try {
      // Comparar la contraseña proporcionada con la almacenada en la base de datos
      const esValido = await bcrypt.compare(contrasena_usuario, this.contrasena_usuario);
      return esValido;
    } catch (error) {
      console.error("Error al comparar las contraseñas:", error);
      throw error;
    }
  }

  // Método para solicitar restablecimiento de contraseña
  static async solicitarRestablecimientoContrasena(correo) {
    try {
      await sequelize.query('CALL SolicitarRestablecimientoContrasena(:correo)', {
        replacements: { correo },
        type: QueryTypes.RAW
      });
      return { message: 'Si el correo existe, se ha enviado un token de recuperación.' };
    } catch (error) {
      console.error(`Error en SolicitarRestablecimientoContrasena: ${error}`);
      throw error;
    }
  }

  // Método para validar el token
  static async validarToken(token) {
    try {
      const result = await sequelize.query('CALL ValidarToken(:token)', {
        replacements: { token },
        type: QueryTypes.RAW
      });
      return result[0];
    } catch (error) {
      console.error(`Error en ValidarToken: ${error}`);
      throw error;
    }
  }

  // Método para actualizar contraseña usando el token
  static async actualizarContrasena(token, nuevaContrasena) {
    try {
      await sequelize.query('CALL ActualizarContrasena(:token, :nueva_contrasena)', {
        replacements: { token, nueva_contrasena },
        type: QueryTypes.RAW
      });
      return { message: 'Contraseña actualizada con éxito' };
    } catch (error) {
      console.error(`Error en ActualizarContrasena: ${error}`);
      throw error;
    }
  }
}

// Inicialización del modelo
Usuario.init({
  documento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  nombre_usuario: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido_usuario: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  correo_electronico_usuario: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  contrasena_usuario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  },
  rol_usuario: {
    type: DataTypes.STRING(50),
    defaultValue: 'Cliente',
    allowNull: true
  },
  estado_usuario: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  token_recuperacion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fecha_token: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'Usuario',
  timestamps: false,
  underscored: false,
});

export default Usuario;
