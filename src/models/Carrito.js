import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";

class Carrito extends Model {

  static async getAllCarritos() {
    try {
      return await Carrito.findAll();
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error);
      throw error;
    }
  }

  static async getCarritoByUsuarioId(documento) {
    try {
      const carrito = await sequelize.query(
        'CALL ObtenerCarritoPorUsuarioId(:documento)',
        {
          replacements: { documento },
          type: QueryTypes.RAW
        }
      );

      // Verifica si carrito es undefined o no tiene resultados
      if (!carrito || carrito.length === 0 || carrito[0].length === 0) {
        console.warn(`No se encontró carrito para el documento: ${documento}`);
        return []; // O maneja este caso como prefieras
      }

      return carrito[0]; // Devuelve el primer conjunto de resultados
    } catch (error) {
      console.error(`Unable to get carrito by usuario ID: ${error}`);
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

  static async addToCarrito(documento, id_producto, cantidad) {
    try {
      const existingItem = await Carrito.findOne({ where: { documento, id_producto } });

      if (existingItem) {
        existingItem.cantidad += cantidad;
        await existingItem.save();
      } else {
        await Carrito.create({ documento, id_producto, cantidad });
      }

      await this.updateTotal(documento);
      return { message: 'Producto agregado al carrito exitosamente' };
    } catch (error) {
      console.error(`Error al agregar producto al carrito: ${error}`);
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

      // Obtener el documento del usuario para actualizar el total
      const carritoItem = await sequelize.query(
        'SELECT documento FROM Carrito WHERE id_carrito = :id_carrito',
        {
          replacements: { id_carrito },
          type: QueryTypes.SELECT
        }
      );

      // Verificar si carritoItem es un array y contiene al menos un elemento
      if (carritoItem.length === 0) {
        throw new Error('Carrito no encontrado');
      }

      // Asegurarse de que carritoItem[0] existe
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