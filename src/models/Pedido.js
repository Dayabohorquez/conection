import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Carrito from './Carrito.js';
import Pago from './Pago.js';
import Usuario from './Usuario.js';
import HistorialPedido from './HistorialPedido.js';

class Pedido extends Model {
  static async obtenerPedidos() {
    try {
      const pedido = await sequelize.query('CALL obtenerPedidos()', { type: QueryTypes.RAW });
      return pedido;
    } catch (error) {
      console.error(`Unable to fetch pedido: ${error}`);
      throw error;
    }
  }

  static async obtenerPedidoPorId(idPedido) {
    try {
      const pedido = await sequelize.query('CALL ObtenerPedidoPorId(:id_pedido)', {
        replacements: { id_pedido: idPedido },
        type: QueryTypes.RAW,
      });
      return pedido;
    } catch (error) {
      console.error(`Unable to find pedido by id: ${error}`);
      throw error;
    }
  }

  static async crearPedido(pedidoData) {
    const { fecha_pedido, total_pagado, documento, pago_id, id_carrito } = pedidoData;

    try {
      const result = await sequelize.query(
        'CALL CrearPedido(:fecha_pedido, :total_pagado, :documento, :pago_id, :id_carrito)',
        {
          replacements: {
            fecha_pedido,
            total_pagado,
            documento,
            pago_id,
            id_carrito,
          },
          type: QueryTypes.RAW,
        }
      );

      return result; // Asegúrate de que esto sea lo que necesitas
    } catch (error) {
      console.error('Error en crearPedido (modelo):', error);
      throw error;
    }
  }

  static async obtenerHistorialPedidosPorUsuarioId(documento) {
    try {
      const historial = await sequelize.query('CALL ObtenerHistorialPedidosPorUsuarioId(:documento)', {
        replacements: { documento },
        type: QueryTypes.RAW,
      });
      return historial;
    } catch (error) {
      console.error(`Unable to find historial de pedidos: ${error}`);
      throw error;
    }
  }

  static async actualizarPedido(idPedido, updatedData) {
    try {
      await sequelize.query('CALL ActualizarPedido(:p_id_pedido, :p_fecha_pedido, :p_total_pagado, :p_documento, :p_pago_id)', {
        replacements: {
          p_id_pedido: idPedido,
          p_fecha_pedido: updatedData.fecha_pedido,
          p_total_pagado: updatedData.total_pagado,
          p_documento: updatedData.documento,
          p_pago_id: updatedData.pago_id
        },
        type: QueryTypes.RAW,
      });

      return { message: 'Pedido actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update pedido: ${error}`);
      throw error;
    }
  }

  static async cambiarEstadoPedido(idPedido, nuevo_estado) {
    try {
      await sequelize.query(
        'CALL ActualizarEstadoPedido(:p_id_pedido, :nuevo_estado)',
        {
          replacements: { p_id_pedido: idPedido, nuevo_estado },
          type: QueryTypes.RAW
        }
      );

      const fechaCambio = new Date();
      await HistorialPedido.create({
        id_pedido: idPedido,
        estado_pedido: nuevo_estado,
        fecha_cambio: fechaCambio,
      });
    } catch (error) {
      console.error('Error en cambiarEstadoPedido (modelo):', error);
      throw error;
    }
  }
}

Pedido.init({
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  fecha_pedido: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado_pedido: {
    type: DataTypes.ENUM('Pendiente', 'Enviado', 'Entregado', 'Cancelado'),
    defaultValue: 'Pendiente',
  },
  total_pagado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  foto_Pedido: {
    type: DataTypes.TEXT,
  },
  foto_PedidoURL: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  tableName: 'Pedido',
  timestamps: false,
  underscored: false,
});

Pedido.belongsTo(Usuario, { foreignKey: 'documento' });
Pedido.belongsTo(Pago, { foreignKey: 'pago_id' });
Pedido.belongsTo(Carrito, { foreignKey: 'id_carrito' });

export default Pedido;
