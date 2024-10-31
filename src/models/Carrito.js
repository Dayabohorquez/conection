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
      return result; // Devuelve el primer conjunto de resultados
    } catch (error) {
      console.error(`Error al obtener el carrito: ${error}`);
      throw error;
    }
  }

  static async obtenerCarritoCompletoPorUsuarioId(documento) {
    try {
      const result = await sequelize.query(
        'CALL ObtenerCarritoCompletoPorUsuarioId(:documento)',
        { replacements: { documento }, type: QueryTypes.RAW }
      );
      return result; // Devuelve el primer conjunto de resultados
    } catch (error) {
      console.error(`Error al obtener el carrito completo: ${error}`);
      throw error;
    }
  }

  static async agregarAlCarrito(documento, id_producto, cantidad) {
    try {
      await sequelize.query(
        'CALL AgregarAlCarrito(:documento, :id_producto, :cantidad)',
        {
          replacements: { documento, id_producto, cantidad },
          type: QueryTypes.RAW,
        }
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
      const result = await sequelize.query(
        'CALL ActualizarCarritoItem(:p_id_carrito_item, :p_opcion_adicional, :p_dedicatoria)',
        {
          replacements: {
            p_id_carrito_item: id_carrito_item,
            p_opcion_adicional: opcion_adicional, // Ahora puede ser null
            p_dedicatoria: dedicatoria // Asegúrate de que este no sea undefined
          },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Item del carrito actualizado exitosamente', result };
    } catch (error) {
      console.error(`Error al actualizar el carrito item: ${error.message}`);
      throw new Error('No se pudo actualizar el item del carrito');
    }
  }

  static async actualizarTotal(id_carrito) {
    try {
      const result = await sequelize.query(
        'CALL ActualizarTotalCarrito(:id_carrito)',
        {
          replacements: { id_carrito },
          type: QueryTypes.RAW,
        }
      );
      return result;
    } catch (error) {
      console.error(`Error al actualizar el total del carrito: ${error.message}`);
      throw new Error('Error al actualizar el total del carrito');
    }
  }

  static async eliminarDelCarrito(id_carrito_item) {
    try {
      await sequelize.query(
        'CALL EliminarItemDelCarrito(:id_carrito_item)',
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
      return result; // Devuelve el primer conjunto de resultados
    } catch (error) {
      console.error(`Error al verificar disponibilidad del producto: ${error}`);
      throw error;
    }
  }

  static async crearCarrito(documento) {
    try {
      const result = await sequelize.query(
        'CALL CrearCarrito(:documento)',
        {
          replacements: { documento },
          type: QueryTypes.RAW,
        }
      );

      console.log(result); // Para depuración

      return result;
    } catch (error) {
      console.error(`Error al crear el carrito: ${error.message}`);
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
    references: {
      model: Usuario,
      key: 'documento'
    }
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Establece la fecha actual por defecto
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: true
  },
  iva: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: true
  },
  total_con_iva: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Carrito',
  timestamps: false
});

// Definir las asociaciones
Carrito.belongsTo(Usuario, { foreignKey: 'documento', targetKey: 'documento' });

export default Carrito;
