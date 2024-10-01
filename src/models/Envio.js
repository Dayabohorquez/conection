import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Pedido from '../models/Pedido.js';

class Envio extends Model {
  // Método para crear un nuevo envío
  static async createEnvio(fecha_envio, pedido_id) {
    try {
      await sequelize.query(
        'CALL CrearEnvio(:fecha_envio, :pedido_id)',
        {
          replacements: { fecha_envio, pedido_id },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Envio creado exitosamente' };
    } catch (error) {
      console.error(`Unable to create envio: ${error}`);
      throw error;
    }
  }
  
  static async getAllEnvios() {
    try {
      const envios = await sequelize.query(
        'CALL ObtenerEnvios()',
        { type: QueryTypes.RAW }
      );
      console.log('Envios:', envios); // Verifica la salida completa
      return envios;
    } catch (error) {
      console.error(`Unable to find all envios: ${error}`);
      throw error;
    }
  }

  // Método para obtener un envío por ID
  static async getEnvioById(id) {
    try {
      const [result] = await sequelize.query(
        'CALL ObtenerEnvioPorId(:id)',
        {
          replacements: { id },
          type: QueryTypes.RAW
        }
      );
      return result || {}; // Asegúrate de que siempre se devuelva un objeto vacío si no hay resultado
    } catch (error) {
      console.error(`Unable to find envio by ID: ${error}`);
      throw error;
    }
  }


  // Método para actualizar un envío por ID
  static async updateEnvio(id, fecha_envio, pedido_id) {
    try {

      await sequelize.query(
        'CALL ActualizarEnvio(:id, :fecha_envio, :pedido_id)',
        {
          replacements: { id, fecha_envio, pedido_id },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Envio actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update envio: ${error}`);
      throw error;
    }
  }

  static async cambiarEstadoEnvio(id_envio, estado_envio) {
    try {
      await sequelize.query(
        'CALL ActualizarEstadoEnvio(:id_envio, :estado_envio)',
        {
          replacements: { id_envio, estado_envio },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Estado de envío actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update envio state: ${error}`);
      throw error;
    }
  }

  // Método para eliminar un envío por ID
  static async deleteEnvio(id) {
    try {
      await sequelize.query(
        'CALL EliminarEnvio(:id)',
        {
          replacements: { id },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Envio eliminado exitosamente' };
    } catch (error) {
      console.error(`Unable to delete envio: ${error}`);
      throw error;
    }
  }
}

// Definición del modelo
Envio.init({
  id_envio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  fecha_envio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado_envio: {
    type: DataTypes.ENUM('Preparando', 'En camino', 'Entregado', 'Retrasado'),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'Envio',
  timestamps: false,
  underscored: false,
});

Envio.belongsTo(Pedido, { foreignKey: 'pedido_id', onDelete: 'CASCADE' });

export default Envio;
