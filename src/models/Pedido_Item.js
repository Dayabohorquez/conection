import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Pedido from './Pedido.js';
import Producto from './Producto.js';

class PedidoItem extends Model {
  static async createPedidoItem(id_pedido, id_producto, cantidad, precio_unitario, opcion_adicional) {
    try {
      const [result] = await sequelize.query(
        'CALL CrearPedidoItem(:id_pedido, :id_producto, :cantidad, :precio_unitario, :opcion_adicional)',
        {
          replacements: { id_pedido, id_producto, cantidad, precio_unitario, opcion_adicional },
          type: QueryTypes.RAW
        }
      );
      return result;
    } catch (error) {
      console.error(`Error al crear item de pedido: ${error}`);
      throw error;
    }
  }

  static async getItemsByPedido(pedido_id) {
    try {
      const items = await sequelize.query(
        'CALL GetPedidoItems(:pedido_id)',
        { replacements: { pedido_id }, type: QueryTypes.RAW }
      );
      return items;
    } catch (error) {
      console.error(`Error al obtener items de pedido: ${error}`);
      throw error;
    }
  }

  static async getPedidoItemById(id_pedido_item) {
    try {
      const [item] = await sequelize.query(
        'CALL ObtenerPedidoItemPorId(:id_pedido_item)',
        { replacements: { id_pedido_item }, type: QueryTypes.RAW }
      );
      return item || {}; // Devuelve un objeto vacío si no hay resultado
    } catch (error) {
      console.error(`Error al obtener item de pedido por ID: ${error}`);
      throw error;
    }
  }

  static async updatePedidoItem(id_pedido_item, cantidad, precio_unitario, opcion_adicional) {
    try {
      await sequelize.query(
        'CALL ActualizarPedidoItem(:id_pedido_item, :cantidad, :precio_unitario, :opcion_adicional)',
        {
          replacements: { id_pedido_item, cantidad, precio_unitario, opcion_adicional },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Item de pedido actualizado exitosamente' };
    } catch (error) {
      console.error(`Error al actualizar item de pedido: ${error}`);
      throw error;
    }
  }

  static async deletePedidoItem(id_pedido_item) {
    try {
      await sequelize.query(
        'CALL EliminarPedidoItem(:id_pedido_item)',
        { replacements: { id_pedido_item }, type: QueryTypes.RAW }
      );
      return { message: 'Item de pedido eliminado exitosamente' };
    } catch (error) {
      console.error(`Error al eliminar item de pedido: ${error}`);
      throw error;
    }
  }
}

PedidoItem.init({
  id_pedido_item: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  opcion_adicional: {
    type: DataTypes.ENUM('Ninguno', 'Vino', 'Chocolates'),
    defaultValue: 'Ninguno',
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'PedidoItem',
  timestamps: false
});

// Definición de las relaciones
PedidoItem.belongsTo(Pedido, { foreignKey: 'id_pedido', onDelete: 'CASCADE' });
PedidoItem.belongsTo(Producto, { foreignKey: 'id_producto', onDelete: 'CASCADE' });

export default PedidoItem;
