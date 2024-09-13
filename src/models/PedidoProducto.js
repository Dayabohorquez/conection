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

  static async actualizarPedido(req, res) {
    const { id_pedido } = req.params;
    const updatedData = req.body;

    try {
      const message = await PedidoProducto.actualizarPedido(id_pedido, updatedData);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
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
