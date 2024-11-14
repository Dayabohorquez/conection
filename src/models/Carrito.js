import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Usuario from './Usuario.js';
import Producto from './Producto.js';
import CarritoItem from './Carrito_Item.js';

class Carrito extends Model {

  // Obtener carrito por usuario
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

  // Obtener carrito completo por usuario
  static async obtenerCarritoCompletoPorUsuarioId(documento) {
    try {
      const result = await sequelize.query(
        'CALL ObtenerCarritoCompletoPorUsuarioId(:documento)',
        { replacements: { documento }, type: QueryTypes.RAW }
      );
      return result;
    } catch (error) {
      console.error(`Error al obtener el carrito completo: ${error}`);
      throw error;
    }
  }

  // Verificar stock del producto
  static async verificarStock(id_producto, cantidad) {
    try {
      // Obtener el stock disponible del producto
      const producto = await Producto.findOne({
        where: { id_producto }
      });

      if (!producto) {
        throw new Error('Producto no encontrado.');
      }

      if (producto.cantidad_disponible < cantidad) {
        throw new Error('La cantidad solicitada excede el stock disponible.');
      }

      return true;
    } catch (error) {
      console.error('Error al verificar stock:', error);
      throw error; // Re-lanzar el error
    }
  }

  // Agregar producto al carrito
  static async agregarAlCarrito(documento, id_producto, cantidad) {
    try {
      // Verificar si hay suficiente stock antes de agregar al carrito
      await this.verificarStock(id_producto, cantidad);

      // Verificar si el carrito del usuario ya existe
      let carrito = await Carrito.findOne({ where: { documento } });

      // Si el carrito no existe, crear uno nuevo para el usuario
      if (!carrito) {
        console.log(`Carrito no encontrado para el usuario ${documento}, creando uno nuevo...`);
        carrito = await Carrito.create({ documento });
      }

      // Ejecutar el procedimiento almacenado para agregar el producto al carrito
      const result = await sequelize.query(
        'CALL AgregarAlCarrito(:documento, :id_producto, :cantidad)',
        {
          replacements: { documento, id_producto, cantidad },
          type: QueryTypes.RAW,
        }
      );

      // Si el procedimiento generó un error, lo lanzamos
      if (result && result[0] && result[0].message) {
        throw new Error(result[0].message);
      }

      return { message: 'Producto agregado al carrito exitosamente' };
    } catch (error) {
      console.error(`Error al agregar al carrito: ${error.message}`);
      throw error;
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  static async actualizarCantidadCarrito(id_carrito_item, cantidad_cambio, id_producto) {
    try {
      // Validación para evitar cantidades cero o negativas si no es para quitar productos
      if (cantidad_cambio === 0) {
        throw new Error('La cantidad de cambio no puede ser 0.');
      }

      // Ejecutar el procedimiento almacenado para actualizar la cantidad del producto
      const result = await sequelize.query(
        'CALL ActualizarCantidadCarrito(:id_carrito_item, :id_producto, :cantidad_cambio)',  // Consulta SQL
        {
          replacements: {
            id_carrito_item,  // Asegúrate de pasar el ID del carrito
            cantidad_cambio,  // Asegúrate de pasar la cantidad de cambio (puede ser negativa)
            id_producto,      // Asegúrate de pasar el ID del producto
          },
          type: QueryTypes.RAW, // Indicamos que es una consulta cruda
        });

      // Mensaje de éxito si la cantidad se actualizó correctamente
      return { message: 'Cantidad actualizada exitosamente' };

    } catch (error) {
      console.error(`Error al actualizar la cantidad: ${error}`);
      throw error; // Propagar el error para ser manejado por la capa superior
    }
  }

  // Actualizar las opciones de un item en el carrito (dedicatoria, opciones adicionales)
  static async actualizarCarritoItem(id_carrito_item, opcion_adicional, dedicatoria) {
    try {
      const result = await sequelize.query(
        'CALL ActualizarCarritoItem(:p_id_carrito_item, :p_opcion_adicional, :p_dedicatoria)',
        {
          replacements: {
            p_id_carrito_item: id_carrito_item,
            p_opcion_adicional: opcion_adicional || null,  // Permitir valores null si no hay opción
            p_dedicatoria: dedicatoria || null  // Permitir valores null si no hay dedicatoria
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

  // Actualizar el total del carrito
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

  // Eliminar un item del carrito
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

  // Vaciar el carrito de un usuario
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

  // Verificar la disponibilidad de un producto
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

  // Crear un carrito para un usuario
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

// Definir la estructura de la tabla y relaciones
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
