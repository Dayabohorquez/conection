import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class TipoFlor extends Model {
  // Obtener todos los tipos de flores
  static async getTiposFlor() {
    try {
      const tiposFlor = await sequelize.query('CALL ObtenerTiposFlor()', { type: QueryTypes.RAW });
      return tiposFlor;
    } catch (error) {
      console.error(`Unable to find all tipos de flor: ${error}`);
      throw error;
    }
  }

  // Obtener tipo de flor por ID
  static async getTipoFlorById(id) {
    try {
      const tipoFlor = await sequelize.query('CALL ObtenerTipoFlorPorId(:id)', {
        replacements: { id },
        type: QueryTypes.RAW
      });
      return tipoFlor;
    } catch (error) {
      console.error(`Unable to find tipo de flor by id: ${error}`);
      throw error;
    }
  }

  // Crear nuevo tipo de flor
  static async createTipoFlor(tipoFlor) {
    try {
      await sequelize.query(
        'CALL CrearTipoFlor(:nombre_tipo_flor, :foto_tipo_flor, :foto_tipo_florURL)', 
        {
          replacements: tipoFlor,
          type: QueryTypes.RAW
        }
      );
      return { message: 'Tipo de flor creado exitosamente' };
    } catch (error) {
      console.error(`Unable to create tipo de flor: ${error}`);
      throw error;
    }
  }

  // Actualizar tipo de flor
  static async updateTipoFlor(id, updatedTipoFlor) {
    try {
      await sequelize.query(
        'CALL ActualizarTipoFlor(:id, :nombre_tipo_flor, :foto_tipo_flor, :foto_tipo_florURL)', 
        {
          replacements: { id, ...updatedTipoFlor },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Tipo de flor actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update tipo de flor: ${error}`);
      throw error;
    }
  }

  // Eliminar tipo de flor
  static async deleteTipoFlor(id) {
    try {
      await sequelize.query('CALL EliminarTipoFlor(:id)', {
        replacements: { id },
        type: QueryTypes.RAW
      });
      return { message: 'Tipo de flor eliminado exitosamente' };
    } catch (error) {
      console.error(`Unable to delete tipo de flor: ${error}`);
      throw error;
    }
  }
}

// Definición del modelo TipoFlor
TipoFlor.init({
  id_tipo_flor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre_tipo_flor: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  foto_tipo_flor: {
    type: DataTypes.TEXT,
  },
  foto_tipo_florURL: {
    type: DataTypes.TEXT,
  }
}, {
  sequelize,
  tableName: 'TipoFlor',
  timestamps: false,
  underscored: false
});

export default TipoFlor;