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
        'CALL CrearUsuario(:tipo_documento, :documento, :nombre_usuario, :apellido_usuario, :correo_electronico_usuario, :contrasena_usuario, :direccion, :fecha_registro, :estado_usuario)',
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
    // Imprime el resultado para depuración
    console.log('Resultado de ObtenerUsuarioPorId:', result);
    // Verifica si el resultado tiene elementos
    if (result.length > 0) {
      return result[0]; // Devolvemos el primer elemento del resultado
    }
    return null;
  } catch (error) {
    console.error(`Unable to find usuario by documento: ${error}`);
    throw error;
  }
}

static async updateUsuario(documento, updated_usuario) {
  try {
    // Encriptar la contraseña si se proporciona
    if (updated_usuario.contrasena_usuario) {
      updated_usuario.contrasena_usuario = await bcrypt.hash(updated_usuario.contrasena_usuario, 10);
    }

    // Imprimir para depuración
    console.log('Actualizando usuario con datos:', {
      documento,
      tipo_documento: updated_usuario.tipo_documento,
      nombre_usuario: updated_usuario.nombre_usuario,
      apellido_usuario: updated_usuario.apellido_usuario,
      correo_electronico_usuario: updated_usuario.correo_electronico_usuario,
      contrasena_usuario: updated_usuario.contrasena_usuario,
      direccion: updated_usuario.direccion,
      fecha_registro: updated_usuario.fecha_registro,
      estado_usuario: updated_usuario.estado_usuario
    });

    // Llamar al procedimiento almacenado
    const result = await sequelize.query(
      'CALL ActualizarUsuario(:documento, :tipo_documento, :nombre_usuario, :apellido_usuario, :correo_electronico_usuario, :contrasena_usuario, :direccion, :fecha_registro, :estado_usuario)',
      {
        replacements: {
          documento,
          tipo_documento: updated_usuario.tipo_documento,
          nombre_usuario: updated_usuario.nombre_usuario,
          apellido_usuario: updated_usuario.apellido_usuario,
          correo_electronico_usuario: updated_usuario.correo_electronico_usuario,
          contrasena_usuario: updated_usuario.contrasena_usuario,
          direccion: updated_usuario.direccion,
          fecha_registro: updated_usuario.fecha_registro,
          estado_usuario: updated_usuario.estado_usuario
        },
        type: QueryTypes.RAW
      }
    );

    // Imprimir el resultado para depuración
    console.log('Resultado de actualización:', result);
    return { message: 'Usuario actualizado exitosamente' };
  } catch (error) {
    console.error(`Unable to update usuario: ${error}`);
    throw error;
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

  // Método para comparar contraseñas
  async comparar(contrasena_usuario) {
    try {
      return await bcrypt.compare(contrasena_usuario, this.contrasena_usuario);
    } catch (error) {
      console.error("Error al comparar las contraseñas:", error);
      throw error;
    }
  }
}

// Inicialización del modelo
Usuario.init({
  tipo_documento: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
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
  }
}, {
  sequelize,
  tableName: 'Usuario',
  timestamps: false,
  underscored: false,
});

export default Usuario;
