import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Carrito from './Carrito.js';
import Producto from './Producto.js';

class CarritoItem extends Model {
  static async getItemsByCarritoId(id_carrito) {
    try {
      const items = await sequelize.query(
        'CALL ObtenerCarritoItemsPorCarritoId(:id_carrito)',
        { replacements: { id_carrito }, type: QueryTypes.RAW }
      );
      return items;
    } catch (error) {
      console.error(`Error al obtener items del carrito: ${error.message}`);
      throw new Error('Error al obtener items del carrito. Por favor, inténtalo de nuevo.');
    }
  }

  static async agregarAlCarrito(documento, id_producto, cantidad, dedicatoria, opcion_adicional, precio_adicional) {
    try {
      await sequelize.query(
        'CALL AgregarItemAlCarrito(:documento, :id_producto, :cantidad, :dedicatoria, :opcion_adicional, :precio_adicional)',
        {
          replacements: {
            documento,
            id_producto,
            cantidad,
            dedicatoria,
            opcion_adicional,
            precio_adicional
          },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Producto agregado al carrito exitosamente' };
    } catch (error) {
      console.error(`Error al agregar producto al carrito: ${error.message}`);
      throw new Error('Error al agregar producto al carrito. Por favor, inténtalo de nuevo.');
    }
  }

  static async updateItemQuantity(id_carrito_item, cantidad) {
    try {
      await sequelize.query(
        'CALL ActualizarCantidadCarritoItem(:id_carrito_item, :cantidad)',
        { replacements: { id_carrito_item, cantidad }, type: QueryTypes.RAW }
      );
      return { message: 'Cantidad actualizada exitosamente' };
    } catch (error) {
      console.error(`Error al actualizar cantidad del item: ${error.message}`);
      throw new Error('Error al actualizar cantidad del item. Por favor, inténtalo de nuevo.');
    }
  }

  static async deleteItemFromCarrito(id_carrito_item) {
    try {
      await sequelize.query(
        'CALL EliminarItemDelCarrito(:id_carrito_item)',
        { replacements: { id_carrito_item }, type: QueryTypes.RAW }
      );
      return { message: 'Item eliminado del carrito exitosamente' };
    } catch (error) {
      console.error(`Error al eliminar item del carrito: ${error.message}`);
      throw new Error('Error al eliminar item del carrito. Por favor, inténtalo de nuevo.');
    }
  }
}

CarritoItem.init({
  id_carrito_item: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_carrito: {
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
  dedicatoria: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  opcion_adicional: {
    type: DataTypes.ENUM('Ninguno', 'Vino', 'Chocolates'),
    allowNull: true
  },
  precio_adicional: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'CarritoItem',
  timestamps: false
});

// Definir las asociaciones
CarritoItem.belongsTo(Carrito, { foreignKey: 'id_carrito', onDelete: 'CASCADE' });
CarritoItem.belongsTo(Producto, { foreignKey: 'id_producto', onDelete: 'CASCADE' });

export default CarritoItem;
