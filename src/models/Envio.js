import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Pedido from '../models/Pedido.js';

class Envio extends Model {
  // Método para crear un nuevo envío
  static async createEnvio(fecha_envio, pedido_id) {
    try {
      const result = await sequelize.query(
        'CALL CrearEnvio(:fecha_envio, :pedido_id)',
        {
          replacements: { fecha_envio, pedido_id },
          type: QueryTypes.RAW
        }
      );
      return (result)
    } catch (error) {
      console.error(`Unable to create envio: ${error}`);
      throw error;
    }
  }

  // Método para obtener todos los envíos
  static async getAllEnvios() {
    try {
      const envios = await sequelize.query(
        'CALL ObtenerEnvios()',
        { type: QueryTypes.RAW }
      );
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
      return result || {}; // Devuelve un objeto vacío si no se encuentra
    } catch (error) {
      console.error(`Unable to find envio by ID: ${error}`);
      throw error;
    }
  }

  static async updateEnvio(id_envio, fecha_envio, pedido_id) {
    try {
      await sequelize.query(
        'CALL ActualizarEnvio(:id_envio, :fecha_envio, :pedido_id)',
        {
          replacements: { id_envio, fecha_envio, pedido_id },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Envío actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update envio: ${error}`);
      throw error;
    }
  }

  // Método para cambiar el estado de un envío
  static async actualizarEstadoEnvio(idEnvio, nuevoEstado) {
    try {
      // Validar que el estado sea uno de los válidos
      const estadosValidos = ['Preparando', 'En camino', 'Entregado', 'Retrasado'];
      if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error('Estado no válido. Debe ser uno de: ' + estadosValidos.join(', '));
      }

      // Llamar al procedimiento almacenado
      await sequelize.query(
        'CALL ActualizarEstadoEnvio(:p_id_envio, :p_estado_envio)',
        {
          replacements: {
            p_id_envio: idEnvio,
            p_estado_envio: nuevoEstado,
          },
          type: QueryTypes.RAW,
        }
      );

      return { message: 'Estado del envío actualizado exitosamente' };
    } catch (error) {
      console.error(`Error al actualizar estado del envío: ${error}`);
      throw error;
    }
  }

  // Método para eliminar un envío por ID
  static async deleteEnvio(id_envio) {
    try {
      await sequelize.query(
        'CALL EliminarEnvio(:p_id_envio)',
        { replacements: { p_id_envio: id_envio }, type: QueryTypes.RAW }
      );
      return { message: 'Envío eliminado exitosamente' };
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
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pedido, // Referencia al modelo Pedido
      key: 'id_pedido'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  tableName: 'Envio',
  timestamps: false,
  underscored: false,
});

// Definición de la relación
Envio.belongsTo(Pedido, { foreignKey: 'pedido_id', onDelete: 'CASCADE' });

export default Envio;
