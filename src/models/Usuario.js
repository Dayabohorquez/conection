import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcrypt';

class Usuario extends Model {
  // Método para crear un usuario
  static async createUsuario(usuario) {
    try {
      const claveEncriptada = await bcrypt.hash(usuario.contrasena_usuario, 10);
      usuario.contrasena_usuario = claveEncriptada;

      await sequelize.query(
        'CALL CrearUsuario(:documento, :nombre_usuario, :apellido_usuario, :correo_electronico_usuario, :contrasena_usuario, :direccion, :fecha_registro, :estado_usuario)',
        {
          replacements: usuario,
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
      console.log('Resultado de ObtenerUsuarios:', usuarios);
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
          replacements: { documento },
          type: QueryTypes.RAW
        }
      );
      console.log('Resultado de ObtenerUsuarioPorId:', result);
      if (result.length > 0) {
        return Usuario.build(result[0]);
      }
      return null;
    } catch (error) {
      console.error(`Unable to find usuario by documento: ${error}`);
      throw error;
    }
  }

  // Método para actualizar un usuario
  static async updateUsuario(documento, updated_usuario) {
    return await sequelize.query(
      'CALL ActualizarUsuario(:documento, :nombre_usuario, :apellido_usuario, :correo_electronico_usuario, :direccion)',
      {
        replacements: {
          documento,
          nombre_usuario: updated_usuario.nombre_usuario,
          apellido_usuario: updated_usuario.apellido_usuario,
          correo_electronico_usuario: updated_usuario.correo_electronico_usuario,
          direccion: updated_usuario.direccion,
        },
        type: QueryTypes.RAW,
      }
    );
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

  // Método para actualizar la contraseña
  static async updatePassword(documento, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sequelize.query(
      'UPDATE Usuario SET contrasena_usuario = :newPassword WHERE documento = :documento',
      {
        replacements: { newPassword: hashedPassword, documento },
        type: QueryTypes.RAW
      }
    );
  }

  // Método para comparar contraseñas
  async comparar(contrasena_usuario) {
    try {
      return await bcrypt.compare(contrasena_usuario, this.contrasena_usuario);
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
      return result[0];  // Devolver el mensaje y el documento
    } catch (error) {
      console.error(`Error en ValidarToken: ${error}`);
      throw error;
    }
  }

  // Método para actualizar la contraseña usando el token
  static async actualizarContrasena(token, nueva_contrasena) {
    try {
      const hashedPassword = await bcrypt.hash(nueva_contrasena, 10);
      const result = await sequelize.query('CALL ActualizarContrasena(:token, :nueva_contrasena)', {
        replacements: { token, nueva_contrasena: hashedPassword },
        type: QueryTypes.RAW
      });
      return result[0];  // Devolver el mensaje
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
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contrasena_usuario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  },
  rol_usuario: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado_usuario: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  token_recuperacion: {  // Nuevo campo para el token de recuperación
    type: DataTypes.STRING,
    allowNull: true
  },
  fecha_token: {  // Nuevo campo para la fecha de expiración del token
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
