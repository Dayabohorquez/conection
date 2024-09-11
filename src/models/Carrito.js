import { DataTypes, Model, QueryTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Producto from './Producto.js';
import Usuario from './Usuario.js';

class Carrito extends Model {
  // Método para obtener el carrito de un usuario
  static async getCarritoByUsuarioId(documento) {
    try {
      const carrito = await sequelize.query(
        'CALL ObtenerCarritoPorUsuarioId(:documento)',
        {
          replacements: { documento },
          type: QueryTypes.RAW
        }
      );
      return carrito[0]; // En MySQL, los resultados se devuelven en un array
    } catch (error) {
      console.error(`Unable to get carrito by usuario ID: ${error}`);
      throw error;
    }
  }

  // Método para agregar un producto al carrito
  static async addToCarrito(id_carrito, documento, id_producto, cantidad) {
    try {
      await sequelize.query(
        'CALL AgregarAlCarrito(:id_carrito, :documento, :id_producto, :cantidad)',
        {
          replacements: { id_carrito, documento, id_producto, cantidad },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Producto agregado al carrito exitosamente' };
    } catch (error) {
      console.error(`Unable to add product to carrito: ${error}`);
      throw error;
    }
  }

  // Método para actualizar la cantidad de un producto en el carrito
  static async updateQuantityInCarrito(id_carrito, cantidad) {
    try {
      await sequelize.query(
        'CALL ActualizarCantidadCarrito(:id_carrito, :cantidad)',
        {
          replacements: { id_carrito, cantidad },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Cantidad actualizada exitosamente' };
    } catch (error) {
      console.error(`Unable to update quantity in carrito: ${error}`);
      throw error;
    }
  }

  // Método para eliminar un producto del carrito
  static async deleteFromCarrito(id_carrito) {
    try {
      await sequelize.query(
        'CALL EliminarDelCarrito(:id_carrito)',
        {
          replacements: { id_carrito },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Producto eliminado del carrito exitosamente' };
    } catch (error) {
      console.error(`Unable to delete product from carrito: ${error}`);
      throw error;
    }
  }

  // Método para vaciar el carrito de un usuario
  static async emptyCarrito(documento) {
    try {
      await sequelize.query(
        'CALL VaciarCarrito(:documento)',
        {
          replacements: { documento },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Carrito vaciado exitosamente' };
    } catch (error) {
      console.error(`Unable to empty carrito: ${error}`);
      throw error;
    }
  }

  // Método para verificar la disponibilidad de un producto en el carrito
  static async checkAvailabilityInCarrito(id_producto, cantidad) {
    try {
      const disponibilidad = await sequelize.query(
        'CALL VerificarDisponibilidadCarrito(:id_producto, :cantidad)',
        {
          replacements: { id_producto, cantidad },
          type: QueryTypes.RAW
        }
      );
      return disponibilidad[0]; // Asume que el procedimiento devuelve la disponibilidad
    } catch (error) {
      console.error(`Unable to check availability in carrito: ${error}`);
      throw error;
    }
  }
}

// Definición del modelo
Carrito.init({
  id_carrito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Asumido que el ID es autoincremental
    allowNull: false,
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
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'Carrito',
  timestamps: false,
  underscored: false,
});

Carrito.belongsTo(Usuario, { foreignKey: 'documento' });
Carrito.belongsTo(Producto, { foreignKey: 'id_producto' });

export default Carrito;
