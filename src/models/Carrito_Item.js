import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Carrito from './Carrito.js';
import Producto from './Producto.js';
import OpcionAdicional from './Opciones_adicionales.js';

class CarritoItem extends Model {
  // Obtener items por ID de carrito
  static async getItemsByCarritoId(id_carrito) {
    try {
      const items = await sequelize.query(
        'CALL ObtenerCarritoItemsPorCarritoId(:id_carrito)',
        { replacements: { id_carrito }, type: QueryTypes.RAW }
      );
      return items[0]; // Asegurarse de devolver la primera fila de resultados
    } catch (error) {
      console.error(`Error al obtener items del carrito: ${error.message}`);
      throw new Error('Error al obtener items del carrito. Por favor, inténtalo de nuevo.');
    }
  }

  // Agregar un producto al carrito
  static async agregarAlCarrito(documento, id_producto, cantidad, dedicatoria, id_opcion) {
    try {
        await sequelize.query(
            'CALL AgregarItemAlCarrito(:documento, :id_producto, :cantidad, :dedicatoria, :id_opcion)',
            {
                replacements: {
                    documento, // Verifica que este valor se está pasando
                    id_producto,
                    cantidad,
                    dedicatoria,
                    id_opcion,
                },
                type: QueryTypes.RAW,
            }
        );
        return { message: 'Producto agregado al carrito exitosamente' };
    } catch (error) {
        console.error(`Error al agregar al carrito: ${error}`);
        throw error;
    }
}

  // Actualizar la cantidad de un item en el carrito
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

  // Eliminar un item del carrito
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

// Inicialización del modelo
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
    type: DataTypes.INTEGER, // Cambiado a INTEGER para coincidir con la estructura de la tabla
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

// Definir asociaciones
CarritoItem.belongsTo(Carrito, { foreignKey: 'id_carrito', onDelete: 'CASCADE' });
CarritoItem.belongsTo(Producto, { foreignKey: 'id_producto', onDelete: 'CASCADE' });
// Agregando asociación para opcion_adicional
CarritoItem.belongsTo(OpcionAdicional, { foreignKey: 'opcion_adicional', onDelete: 'SET NULL' });

export default CarritoItem;
