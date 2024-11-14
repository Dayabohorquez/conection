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
      return items[0]; // Devolvemos la primera fila de resultados
    } catch (error) {
      console.error(`Error al obtener items del carrito: ${error.message}`);
      throw new Error('Error al obtener items del carrito. Por favor, inténtalo de nuevo.');
    }
  }

  // Agregar un producto al carrito
  static async agregarAlCarrito(documento, id_producto, cantidad, dedicatoria, id_opcion) {
    const transaction = await sequelize.transaction();

    try {
      // Verificamos el stock antes de agregar el producto
      const producto = await Producto.findOne({ where: { id_producto } });
      if (!producto) {
        throw new Error('Producto no encontrado.');
      }

      const stockDisponible = producto.stock; // Asumiendo que `Producto` tiene un campo `stock`
      if (stockDisponible < cantidad) {
        throw new Error('No hay suficiente stock para este producto.');
      }

      // Verificar si el carrito del usuario ya existe
      let carrito = await Carrito.findOne({ where: { documento } });

      if (!carrito) {
        // Si no existe, crear un nuevo carrito para el usuario
        carrito = await Carrito.create({ documento });
      }

      // Llamamos al procedimiento almacenado para agregar el item al carrito
      const result = await sequelize.query(
        'CALL AgregarItemAlCarrito(:documento, :id_producto, :cantidad, :dedicatoria, :id_opcion)', 
        {
          replacements: { documento, id_producto, cantidad, dedicatoria, id_opcion },
          type: QueryTypes.RAW,
          transaction,
        }
      );

      // Si el procedimiento generó un error, lo lanzamos
      if (result && result[0] && result[0].message) {
        throw new Error(result[0].message);
      }

      // Confirmamos los cambios con la transacción
      await transaction.commit();
      return { message: 'Producto agregado al carrito exitosamente' };

    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      await transaction.rollback();  // Revertir la transacción en caso de error
      throw error;
    }
  }

  // Actualizar la cantidad de un item en el carrito
  static async updateItemQuantity(id_carrito_item, cantidad) {
    try {
      if (cantidad <= 0) {
        throw new Error('La cantidad debe ser mayor que 0');
      }

      // Llamamos al procedimiento almacenado para actualizar la cantidad
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
      // Verificamos si el item realmente existe
      const item = await CarritoItem.findByPk(id_carrito_item);
      if (!item) {
        throw new Error('El item no existe en el carrito.');
      }

      // Llamamos al procedimiento almacenado para eliminar el item
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
CarritoItem.belongsTo(OpcionAdicional, { foreignKey: 'opcion_adicional', onDelete: 'SET NULL' });

export default CarritoItem;
