import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class Carrito extends Model {
  // Agregar producto al carrito
  static async agregarProducto(documento, id_producto, cantidad) {
    try {
      await sequelize.query('CALL agregar_producto_carrito(:p_documento, :p_id_producto, :p_cantidad)', {
        replacements: { 
          p_documento: documento, 
          p_id_producto: id_producto, 
          p_cantidad: cantidad 
        },
        type: QueryTypes.RAW
      });
      return { message: 'Producto agregado al carrito exitosamente' };
    } catch (error) {
      console.error('Unable to add product to cart:', error);
      throw error; // Para que el controlador pueda manejar el error
    }
  }

  // Actualizar cantidad de producto en el carrito
  static async actualizarCantidad(documento, id_producto, nueva_cantidad) {
    try {
      await sequelize.query(
        'CALL actualizar_cantidad_carrito(:documento, :id_producto, :nueva_cantidad)', 
        {
          replacements: { documento, id_producto, nueva_cantidad },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Cantidad actualizada exitosamente' };
    } catch (error) {
      console.error(`Unable to update product quantity: ${error}`);
      throw error;
    }
  }

  // Eliminar producto del carrito
  static async eliminarProducto(documento, id_producto) {
    try {
      await sequelize.query('CALL eliminar_producto_carrito(:documento, :id_producto)', {
        replacements: { documento, id_producto },
        type: QueryTypes.RAW
      });
      return { message: 'Producto eliminado del carrito exitosamente' };
    } catch (error) {
      console.error(`Unable to delete product from cart: ${error}`);
      throw error;
    }
  }

  // Ver contenido del carrito
  static async verContenido(documento) {
    try {
      const contenido = await sequelize.query('CALL ver_contenido_carrito(:documento)', {
        replacements: { documento },
        type: QueryTypes.RAW
      });
      return contenido;
    } catch (error) {
      console.error(`Unable to view cart content: ${error}`);
      throw error;
    }
  }

  // Limpiar carrito
  static async limpiarCarrito(documento) {
    try {
      await sequelize.query('CALL limpiar_carrito(:documento)', {
        replacements: { documento },
        type: QueryTypes.RAW
      });
      return { message: 'Carrito limpiado exitosamente' };
    } catch (error) {
      console.error(`Unable to clear cart: ${error}`);
      throw error;
    }
  }
}

// Definición del modelo Carrito
Carrito.init({
  id_carrito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_agregado: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  tableName: 'Carrito',
  timestamps: false,
  underscored: false
});

export default Carrito;
