import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Usuario from './Usuario.js';

class Carrito extends Model {
  static async obtenerCarritoPorUsuarioId(documento) {
    try {
      const result = await sequelize.query(
        'CALL ObtenerCarritoPorUsuarioId(:documento)',
        { replacements: { documento }, type: QueryTypes.RAW }
      );
      return result;
    } catch (error) {
      console.error(`Error al obtener el carrito: ${error}`);
      throw error;
    }
  }

  static async ObtenerCarritoCompletoPorUsuarioId(documento) {
    try {
      const result = await sequelize.query(
        'CALL ObtenerCarritoCompletoPorUsuarioId(:documento)',
        {
          replacements: { documento },
          type: QueryTypes.RAW,
        }
      );
      return result; // Devuelve el primer conjunto de resultados
    } catch (error) {
      console.error(`Error al obtener el carrito: ${error}`);
      throw error; // Lanza el error para manejarlo en el controlador
    }
  }

  static async agregarAlCarrito(documento, id_producto, cantidad) {
    try {
      await sequelize.query(
        'CALL AgregarAlCarrito(:documento, :id_producto, :cantidad)',
        { replacements: { documento, id_producto, cantidad }, type: QueryTypes.RAW }
      );
      return { message: 'Producto agregado al carrito exitosamente' };
    } catch (error) {
      console.error(`Error al agregar al carrito: ${error}`);
      throw error;
    }
  }

  static async actualizarCantidadCarrito(id_carrito_item, cantidad) {
    try {
      await sequelize.query(
        'CALL ActualizarCantidadCarrito(:id_carrito_item, :cantidad)',
        { replacements: { id_carrito_item, cantidad }, type: QueryTypes.RAW }
      );
      return { message: 'Cantidad actualizada exitosamente' };
    } catch (error) {
      console.error(`Error al actualizar la cantidad: ${error}`);
      throw error;
    }
  }

  static async actualizarCarritoItem(id_carrito_item, opcion_adicional, dedicatoria) {
    try {
      await sequelize.query(
        'CALL ActualizarCarritoItem(:id_carrito_item, :opcion_adicional, :dedicatoria)',
        {
          replacements: { id_carrito_item, opcion_adicional, dedicatoria },
          type: QueryTypes.RAW,
        }
      );
    } catch (error) {
      console.error('Error al actualizar el carrito item:', error);
      throw error; // Lanza el error para manejarlo en el controlador
    }
  }

  static async actualizarTotal(id_carrito) {
    try {
      await sequelize.query('CALL ActualizarTotalCarrito(:id_carrito)', {
        replacements: { id_carrito },
        type: QueryTypes.RAW,
      });
    } catch (error) {
      console.error(`Error al actualizar el total del carrito: ${error}`);
      throw error;
    }
  }

  static async eliminarDelCarrito(id_carrito_item) {
    try {
      await sequelize.query(
        'CALL EliminarDelCarrito(:id_carrito_item)',
        { replacements: { id_carrito_item }, type: QueryTypes.RAW }
      );
      return { message: 'Producto eliminado del carrito exitosamente' };
    } catch (error) {
      console.error(`Error al eliminar del carrito: ${error}`);
      throw error;
    }
  }

  static async vaciarCarrito(documento) {
    try {
      await sequelize.query(
        'CALL VaciarCarrito(:documento)',
        { replacements: { documento }, type: QueryTypes.RAW }
      );
      return { message: 'Carrito vaciado exitosamente' };
    } catch (error) {
      console.error(`Error al vaciar el carrito: ${error}`);
      throw error;
    }
  }

  static async verificarDisponibilidadProducto(id_producto, cantidad) {
    try {
      const result = await sequelize.query(
        'CALL VerificarDisponibilidadProducto(:id_producto, :cantidad)',
        { replacements: { id_producto, cantidad }, type: QueryTypes.RAW }
      );
      return result;
    } catch (error) {
      console.error(`Error al verificar disponibilidad del producto: ${error}`);
      throw error;
    }
  }

  static async crearCarrito(documento) {
    try {
      const result = await sequelize.query(
        'INSERT INTO Carrito (documento, total) VALUES (:documento, :total)',
        {
          replacements: { documento, total: 0 },
          type: QueryTypes.INSERT,
        }
      );

      return { message: 'Carrito creado exitosamente', id_carrito: result[0] };
    } catch (error) {
      console.error(`Error al crear el carrito: ${error}`);
      throw new Error('No se pudo crear el carrito.');
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
  fecha: {
    type: DataTypes.DATE,
    allowNull: true // Puede ser NULL si no se establece automáticamente
  },
  total: {
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

export default Carrito;