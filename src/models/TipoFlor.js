import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class TipoFlor extends Model {
  // Obtener todos los tipos de flores
  static async getTiposFlor() {
    try {
      const tiposFlor = await sequelize.query('CALL ObtenerTiposFlor()', { type: QueryTypes.RAW });
      return tiposFlor;
    } catch (error) {
      console.error(`No se pudieron obtener los tipos de flor: ${error}`);
      throw error;
    }
  }

  // Obtener tipo de flor por ID
  static async getTipoFlorById(id) {
    if (!id) {
      throw new Error('El ID no puede estar vacío');
    }

    try {
      const tipoFlor = await sequelize.query('CALL ObtenerTipoFlorPorId(:id)', {
        replacements: { id: id }, // Asegurándonos de que el ID esté definido correctamente
        type: QueryTypes.RAW
      });
      return tipoFlor[0] ? tipoFlor[0] : null; // Retorna el primer resultado o null si no hay resultados
    } catch (error) {
      console.error(`No se pudo encontrar el tipo de flor por ID: ${error}`);
      throw error;
    }
  }

  // Crear nuevo tipo de flor
  static async createTipoFlor(tipoFlorData) {
    try {
      await sequelize.query('CALL CrearTipoFlor(:nombre_tipo_flor)', {
        replacements: tipoFlorData,
        type: QueryTypes.RAW
      });
      return { message: 'Tipo de flor creado exitosamente' };
    } catch (error) {
      console.error(`No se pudo crear el tipo de flor: ${error}`);
      throw error;
    }
  }

  // Actualizar tipo de flor
  static async updateTipoFlor(id, tipoFlorData) {
    try {
      await sequelize.query('CALL ActualizarTipoFlor(:id, :nombre_tipo_flor)', {
        replacements: { id, ...tipoFlorData },
        type: QueryTypes.RAW
      });
      return { message: 'Tipo de flor actualizado exitosamente' };
    } catch (error) {
      console.error(`No se pudo actualizar el tipo de flor: ${error}`);
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
      console.error(`No se pudo eliminar el tipo de flor: ${error}`);
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
  }
}, {
  sequelize,
  tableName: 'Tipo_Flor',
  timestamps: false,
  underscored: false
});

export default TipoFlor;
