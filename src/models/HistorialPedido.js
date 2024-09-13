import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Pedido from '../models/Pedido.js';

class HistorialPedido extends Model {
  // Método para crear un nuevo registro en el historial
  static async createHistorial(pedidoId, estadoPedido) {
    try {
      await sequelize.query(
        'CALL CrearHistorialPedido(:id_pedido, :estado_pedido, :fecha_cambio)', 
        {
          replacements: {
            id_pedido: pedidoId,
            estado_pedido: estadoPedido,
            fecha_cambio: new Date() // Puedes ajustar la fecha aquí si es necesario
          },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Historial de pedido creado exitosamente' };
    } catch (error) {
      console.error(`Unable to create historial: ${error}`);
      throw error;
    }
  }

  // Método para obtener todos los registros del historial
  static async getAllHistorial() {
    try {
      const historial = await sequelize.query('CALL ObtenerHistorialPedidos()', { type: QueryTypes.RAW });
      return historial;
    } catch (error) {
      console.error(`Unable to find all historial: ${error}`);
      throw error;
    }
  }

  // Método para obtener el historial por ID de pedido
  static async getHistorialByPedidoId(pedidoId) {
    try {
      const historial = await sequelize.query('CALL ObtenerHistorialPorPedidoId(:pedidoId)', {
        replacements: { pedidoId },
        type: QueryTypes.RAW
      });
      return historial;
    } catch (error) {
      console.error(`Unable to find historial by pedido ID: ${error}`);
      throw error;
    }
  }
}

// Definición del modelo
HistorialPedido.init({
  id_historial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  estado_pedido: {
    type: DataTypes.ENUM('Pendiente', 'Enviado', 'Entregado', 'Cancelado'),
    allowNull: false,
  },
  fecha_cambio: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'HistorialPedido',
  timestamps: false,
  underscored: false,
});

// Relaciones
HistorialPedido.belongsTo(Pedido, { foreignKey: 'id_pedido' });

export default HistorialPedido;
