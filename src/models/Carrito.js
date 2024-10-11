import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";

class Carrito extends Model {

  static async getAllCarritos() {
    try {
      const carritos = await Carrito.findAll();
      return carritos;
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error);
      throw error;
    }
  }

  static async updateTotal(documento) {
    try {
      const carritoItems = await sequelize.query(
        'SELECT SUM(p.precio_producto * c.cantidad) AS total FROM Carrito c JOIN Producto p ON c.id_producto = p.id_producto WHERE c.documento = :documento',
        {
          replacements: { documento },
          type: QueryTypes.SELECT
        }
      );

      const total = carritoItems[0].total || 0;

      await sequelize.query(
        'UPDATE Carrito SET total = :total WHERE documento = :documento',
        {
          replacements: { total, documento },
          type: QueryTypes.UPDATE
        }
      );
      return total;
    } catch (error) {
      console.error("Error al actualizar el total del carrito:", error);
      throw error;
    }
  }

  static async getCarritoByUsuarioId(documento) {
    try {
      const carrito = await sequelize.query(
        'CALL ObtenerCarritoPorUsuarioId(:documento)',
        {
          replacements: { documento },
          type: QueryTypes.SELECT
        }
      );
      return carrito[0]; // Asegúrate de que esto devuelva todas las filas.
    } catch (error) {
      console.error(`Unable to get carrito by usuario ID: ${error}`);
      throw error;
    }
  }

  static async addToCarrito(documento, id_producto, cantidad) {
    try {
      console.log('Parámetros para la consulta:', { documento, id_producto, cantidad });

      await sequelize.query(
        'CALL AgregarAlCarrito(:documento, :id_producto, :cantidad)',
        {
          replacements: {
            documento,
            id_producto,
            cantidad
          },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Producto agregado al carrito exitosamente' };
    } catch (error) {
      console.error(`Unable to add product to carrito: ${error}`);
      throw error;
    }
  }

  static async updateQuantityInCarrito(id_carrito, cantidad) {
    try {
      await sequelize.query(
        'CALL ActualizarCantidadCarrito(:id_carrito, :cantidad)',
        {
          replacements: { id_carrito, cantidad },
          type: QueryTypes.RAW
        }
      );

      const carritoItem = await sequelize.query(
        'SELECT documento FROM Carrito WHERE id_carrito = :id_carrito',
        {
          replacements: { id_carrito },
          type: QueryTypes.SELECT
        }
      );

      if (carritoItem.length === 0) {
        throw new Error('Carrito no encontrado');
      }

      const documento = carritoItem[0]?.documento;
      if (documento === undefined) {
        throw new Error('Documento no encontrado en el carrito');
      }

      await this.updateTotal(documento);

      return { message: 'Cantidad actualizada exitosamente' };
    } catch (error) {
      console.error(`Unable to update quantity in carrito: ${error}`);
      throw error;
    }
  }

  static async deleteFromCarrito(id_carrito) {
    try {
      const carritoItem = await sequelize.query(
        'SELECT documento FROM Carrito WHERE id_carrito = :id_carrito',
        {
          replacements: { id_carrito },
          type: QueryTypes.SELECT
        }
      );

      if (carritoItem.length === 0) {
        throw new Error('Carrito no encontrado');
      }

      const documento = carritoItem[0]?.documento;
      if (documento === undefined) {
        throw new Error('Documento no encontrado en el carrito');
      }

      await sequelize.query(
        'CALL EliminarDelCarrito(:id_carrito)',
        {
          replacements: { id_carrito },
          type: QueryTypes.RAW
        }
      );

      await this.updateTotal(documento);

      return { message: 'Producto eliminado del carrito exitosamente' };
    } catch (error) {
      console.error(`Unable to delete product from carrito: ${error}`);
      throw error;
    }
  }

  // Método para vaciar el carrito basado en el id_carrito
  static async vaciarCarrito(id_carrito) {
    try {
      await sequelize.query(
        'CALL VaciarCarrito(:id_carrito)',
        {
          replacements: { id_carrito },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Carrito vaciado exitosamente' };
    } catch (error) {
      console.error(`Error al vaciar carrito: ${error}`);
      throw error;
    }
  }

  static async checkAvailabilityInCarrito(id_producto, cantidad) {
    try {
      const result = await sequelize.query(
        'CALL VerificarDisponibilidadProducto(:id_producto, :cantidad)',
        {
          replacements: { id_producto, cantidad },
          type: QueryTypes.RAW
        }
      );

      return result;
    } catch (error) {
      console.error(`Unable to check product availability: ${error}`);
      throw error;
    }
  }
}

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
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Carrito',
  timestamps: false
});

export default Carrito;
