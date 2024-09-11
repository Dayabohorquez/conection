import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Pedido from './Pedido.js';
import Producto from './Producto.js';

class PedidoProducto extends Model {
  static async eliminarPedido(pedidoId) {
    try {
      await sequelize.query('CALL EliminarPedido(:pedidoId)', {
        replacements: { pedidoId },
        type: QueryTypes.RAW,
      });
      return { message: 'Pedido y productos asociados eliminados exitosamente' };
    } catch (error) {
      console.error(`Unable to delete pedido: ${error}`);
      throw error;
    }
  }

  static async actualizarPedido(pedidoId, updatedData) {
    try {
      await sequelize.query('CALL ActualizarPedido(:id_pedido, :fecha_pedido, :estado_pedido, :total_pagado, :foto_Pedido, :foto_PedidoURL, :documento, :pago_id)', {
        replacements: { id_pedido: pedidoId, ...updatedData },
        type: QueryTypes.RAW,
      });
      return { message: 'Pedido actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update pedido: ${error}`);
      throw error;
    }
  }

}

PedidoProducto.init({
  id_pedido_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'PedidoProducto',
  timestamps: false,
  underscored: false,
});

PedidoProducto.belongsTo(Pedido, { foreignKey: 'pedido_id' });
PedidoProducto.belongsTo(Producto, { foreignKey: 'producto_id' });

export default PedidoProducto;
