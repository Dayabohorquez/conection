import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Usuario from './Usuario.js';
import Producto from './Producto.js';

class Carrito extends Model {

  static async getAllCarritos() {
    try {
      return await Carrito.findAll();
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error);
      throw error;
    }
  }

  static async updateTotal(documento) {
    try {
      const [carritoItems] = await sequelize.query(
        'SELECT SUM(c.cantidad * p.precio_producto) AS total FROM Carrito c JOIN Producto p ON c.id_producto = p.id_producto WHERE c.documento = :documento',
        { replacements: { documento }, type: QueryTypes.SELECT }
      );

      const total = carritoItems?.total || 0;

      await sequelize.query(
        'UPDATE Carrito SET total = :total WHERE documento = :documento',
        { replacements: { total, documento }, type: QueryTypes.UPDATE }
      );

      return total;
    } catch (error) {
      console.error("Error al actualizar el total del carrito:", error);
      throw error;
    }
  }

  static async getCarritoByUsuarioId(documento) {
    try {
      const [carrito] = await sequelize.query(
        'CALL ObtenerCarritoPorUsuarioId(:documento)',
        { replacements: { documento }, type: QueryTypes.SELECT }
      );
      return carrito || []; // Devuelve un array vacío si no hay resultados
    } catch (error) {
      console.error(`Error al obtener carrito por usuario ID: ${error}`);
      throw error;
    }
  }

  static async addToCarrito(documento, id_producto, cantidad, precio_adicional) {
    try {
      // Verificar que la cantidad sea válida
      if (cantidad < 1) {
        throw new Error('La cantidad debe ser al menos 1.');
      }

      const [usuarioExists] = await sequelize.query(
        'SELECT COUNT(*) AS count FROM Usuario WHERE documento = :documento',
        { replacements: { documento }, type: QueryTypes.SELECT }
      );

      if (usuarioExists.count === 0) {
        throw new Error('El documento no encontrado o inválido.');
      }

      // Llamar al procedimiento almacenado para agregar al carrito
      await sequelize.query(
        'CALL AgregarAlCarrito(:documento, :id_producto, :cantidad, :precio_adicional)',
        { replacements: { documento, id_producto, cantidad, precio_adicional }, type: QueryTypes.RAW }
      );

      return { message: 'Producto agregado al carrito exitosamente' };
    } catch (error) {
      console.error(`No se pudo agregar el producto al carrito: ${error.message}`);
      throw error;
    }
  }

  static async updateQuantityInCarrito(id_carrito, cantidad) {
    try {
      // Verificar que la cantidad sea válida
      if (cantidad < 1) {
        throw new Error('La cantidad debe ser al menos 1.');
      }

      await sequelize.query(
        'CALL ActualizarCantidadCarrito(:id_carrito, :cantidad)',
        { replacements: { id_carrito, cantidad }, type: QueryTypes.RAW }
      );

      const [carritoItem] = await sequelize.query(
        'SELECT documento FROM Carrito WHERE id_carrito = :id_carrito',
        { replacements: { id_carrito }, type: QueryTypes.SELECT }
      );

      if (!carritoItem) {
        throw new Error('Carrito no encontrado');
      }

      const documento = carritoItem.documento;
      await this.updateTotal(documento);

      return { message: 'Cantidad actualizada exitosamente' };
    } catch (error) {
      console.error(`Error al actualizar la cantidad en carrito: ${error}`);
      throw error;
    }
  }

  static async deleteFromCarrito(id_carrito) {
    try {
      const [carritoItem] = await sequelize.query(
        'SELECT documento FROM Carrito WHERE id_carrito = :id_carrito',
        { replacements: { id_carrito }, type: QueryTypes.SELECT }
      );

      if (!carritoItem) {
        throw new Error('Carrito no encontrado');
      }

      const documento = carritoItem.documento;

      await sequelize.query(
        'CALL EliminarDelCarrito(:id_carrito)',
        { replacements: { id_carrito }, type: QueryTypes.RAW }
      );

      await this.updateTotal(documento);

      return { message: 'Producto eliminado del carrito exitosamente' };
    } catch (error) {
      console.error(`Error al eliminar producto del carrito: ${error}`);
      throw error;
    }
  }

  static async vaciarCarrito(documento) {
    try {
      await sequelize.query(
        'CALL VaciarCarrito(:documento)',
        { replacements: { documento }, type: QueryTypes.RAW }
      );

      return 'Carrito vaciado exitosamente';
    } catch (error) {
      console.error(`Error al vaciar carrito: ${error}`);
      throw error;
    }
  }

  static async checkAvailabilityInCarrito(id_producto, cantidad) {
    try {
      const [result] = await sequelize.query(
        'CALL VerificarDisponibilidadProducto(:id_producto, :cantidad)',
        { replacements: { id_producto, cantidad }, type: QueryTypes.RAW }
      );

      return result;
    } catch (error) {
      console.error(`Error al verificar disponibilidad del producto: ${error}`);
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
  fecha_agregado: {
    type: DataTypes.DATE,
    allowNull: true // Puede ser NULL si no se establece automáticamente
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: true
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'Carrito',
  timestamps: false
});

// Definir las asociaciones
Carrito.belongsTo(Usuario, { foreignKey: 'documento', targetKey: 'documento' });
Carrito.belongsTo(Producto, { foreignKey: 'id_producto', targetKey: 'id_producto' });


export default Carrito;
