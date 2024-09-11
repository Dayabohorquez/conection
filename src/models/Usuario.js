import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcrypt';

class Usuario extends Model {
  static async createUsuario(usuario) {
    try {
      const claveEncriptada = await bcrypt.hash(usuario.contrasena_usuario, 10);
      usuario.contrasena_usuario = claveEncriptada;

      await sequelize.query(
        'CALL CrearUsuario(:tipo_documento, :documento, :nombre_usuario, :apellido_usuario, :celular_usuario, :correo_electronico_usuario, :usuario, :contrasena_usuario, :direccion, :fecha_registro, :rol_usuario, :estado_usuario)', 
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

  static async getUsuarios() {
    try {
      const usuarios = await sequelize.query('CALL ObtenerUsuarios()', { type: QueryTypes.RAW });
      return usuarios;
    } catch (error) {
      console.error(`Unable to find all usuarios: ${error}`);
      throw error;
    }
  }

  static async getUsuarioById(id) {
    try {
      const usuario = await sequelize.query('CALL ObtenerUsuarioPorId(:documento)', {
        replacements: { documento: id },
        type: QueryTypes.RAW
      });
      return usuario;
    } catch (error) {
      console.error(`Unable to find usuario by id: ${error}`);
      throw error;
    }
  }

  static async updateUsuario(id, updated_usuario) {
    try {
      await sequelize.query(
        'CALL ActualizarUsuario(:tipo_documento, :documento, :nombre_usuario, :apellido_usuario, :celular_usuario, :correo_electronico_usuario, :usuario, :contrasena_usuario, :direccion, :fecha_registro, :rol_usuario, :estado_usuario)', 
        {
          replacements: { documento: id, ...updated_usuario },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Usuario actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update usuario: ${error}`);
      throw error;
    }
  }

  static async toggleUsuarioState(id) {
    try {
      await sequelize.query('CALL CambiarEstadoUsuario(:documento)', {
        replacements: { documento: id },
        type: QueryTypes.RAW
      });
      return { message: 'Estado de usuario actualizado' };
    } catch (error) {
      console.error(`Unable to toggle usuario state: ${error}`);
      throw error;
    }
  }

  static async getUsuariosByRol(rol_usuario) {
    try {
      const usuarios = await sequelize.query('CALL ObtenerUsuariosPorRol(:rol_usuario)', {
        replacements: { rol_usuario },
        type: QueryTypes.RAW
      });
      return usuarios;
    } catch (error) {
      console.error(`Unable to find usuarios by rol: ${error}`);
      throw error;
    }
  }

  static async getUsuarioByCorreo(correo_electronico_usuario) {
    try {
      const usuario = await sequelize.query('CALL BuscarUsuarioPorCorreo(:correo_electronico_usuario)', {
        replacements: { correo_electronico_usuario },
        type: QueryTypes.RAW
      });
      return usuario;
    } catch (error) {
      console.error(`Unable to find usuario by correo: ${error}`);
      throw error;
    }
  }

  async comparar(contrasena_usuario) {
    try {
      return await bcrypt.compare(contrasena_usuario, this.contrasena_usuario);
    } catch (error) {
      console.error("Error al comparar las contraseñas:", error);
      throw error;
    }
  }
}

Usuario.init({
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo_documento: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  nombre_usuario: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido_usuario: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  celular_usuario: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  correo_electronico_usuario: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  usuario: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  contrasena_usuario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(255)
  },
  fecha_registro: {
    type: DataTypes.DATE
  },
  rol_usuario: {
    type: DataTypes.ENUM('Cliente', 'Administrador', 'Vendedor', 'Domiciliario'),
    allowNull: false
  },
  estado_usuario: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'Usuario',
  timestamps: false,
  underscored: false,
});

export default Usuario;
