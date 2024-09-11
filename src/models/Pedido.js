import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db";
import Carrito from './Carrito.js';
import Pago from './Pago.js';
import Usuario from './Usuario.js';

class Pedido extends Model {
  static async obtenerPedidos() {
    try {
      const pedidos = await sequelize.query('CALL ObtenerPedidos()', { type: QueryTypes.RAW });
      return pedidos;
    } catch (error) {
      console.error(`Unable to find all pedidos: ${error}`);
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
    try {
      await sequelize.query('CALL CrearPedido(:id_pedido, :fecha_pedido, :estado_pedido, :total_pagado, :foto_Pedido, :foto_PedidoURL, :documento, :pago_id)', {
        replacements: pedidoData,
        type: QueryTypes.RAW,
      });
      return { message: 'Pedido creado exitosamente' };
    } catch (error) {
      console.error(`Unable to create pedido: ${error}`);
      throw error;
    }
  }

  static async actualizarPedido(idPedido, updatedData) {
    try {
      await sequelize.query('CALL ActualizarPedido(:id_pedido, :fecha_pedido, :estado_pedido, :total_pagado, :foto_Pedido, :foto_PedidoURL, :documento, :pago_id)', {
        replacements: { id_pedido: idPedido, ...updatedData },
        type: QueryTypes.RAW,
      });
      return { message: 'Pedido actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update pedido: ${error}`);
      throw error;
    }
  }

  static async eliminarPedido(idPedido) {
    try {
      await sequelize.query('CALL EliminarPedido(:id_pedido)', {
        replacements: { id_pedido: idPedido },
        type: QueryTypes.RAW,
      });
      return { message: 'Pedido y productos asociados eliminados exitosamente' };
    } catch (error) {
      console.error(`Unable to delete pedido: ${error}`);
      throw error;
    }
  }

  static async obtenerHistorialComprasPorUsuarioId(documento) {
    try {
      const historial = await sequelize.query('CALL ObtenerHistorialComprasPorUsuarioId(:documento)', {
        replacements: { documento },
        type: QueryTypes.RAW,
      });
      return historial;
    } catch (error) {
      console.error(`Unable to find historial de compras: ${error}`);
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
