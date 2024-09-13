import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Pedido from './Pedido.js';

class DetallePedido extends Model {
  // Método para crear un nuevo detalle de pedido
  static async createDetallePedido(id_pedido, nombre_producto, codigo_producto, precio, direccion, cantidad, opciones_adicionales, dedicatoria) {
    try {
      await sequelize.query(
        'CALL CrearDetallePedido(:id_pedido, :nombre_producto, :codigo_producto, :precio, :direccion, :cantidad, :opciones_adicionales, :dedicatoria)',
        {
          replacements: { id_pedido, nombre_producto, codigo_producto, precio, direccion, cantidad, opciones_adicionales, dedicatoria },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Detalle de pedido creado exitosamente' };
    } catch (error) {
      console.error(`Unable to create detalle pedido: ${error}`);
      throw error;
    }
  }

  // Método para obtener todos los detalles de pedidos
  static async getAllDetalles() {
    try {
      const detalles = await sequelize.query('CALL ObtenerDetallesPedidos()', { type: QueryTypes.RAW });
      return detalles;
    } catch (error) {
      console.error(`Error al obtener detalles de pedidos: ${error.message}`);
      throw error;
    }
  }

  // Método para obtener un detalle de pedido por ID
  static async getDetallePedidoById(id) {
    try {
      const [result] = await sequelize.query(
        'CALL ObtenerDetallePedidoPorId(:id)',
        {
          replacements: { id },
          type: QueryTypes.RAW
        }
      );
      return result;  // Devuelve el resultado directamente
    } catch (error) {
      console.error(`Unable to find detalle pedido by ID: ${error}`);
      throw error;
    }
  }
  
  // Método para actualizar un detalle de pedido por ID
  static async updateDetallePedido(id, id_pedido, nombre_producto, codigo_producto, precio, direccion, cantidad, opciones_adicionales, dedicatoria) {
    try {
      await sequelize.query(
        'CALL ActualizarDetallePedido(:id, :id_pedido, :nombre_producto, :codigo_producto, :precio, :direccion, :cantidad, :opciones_adicionales, :dedicatoria)',
        {
          replacements: { id, id_pedido, nombre_producto, codigo_producto, precio, direccion, cantidad, opciones_adicionales, dedicatoria },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Detalle de pedido actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update detalle pedido: ${error}`);
      throw error;
    }
  }

  // Método para eliminar un detalle de pedido por ID
  static async deleteDetallePedido(id) {
    try {
      await sequelize.query(
        'CALL EliminarDetallePedido(:id)',
        {
          replacements: { id },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Detalle de pedido eliminado exitosamente' };
    } catch (error) {
      console.error(`Unable to delete detalle pedido: ${error}`);
      throw error;
    }
  }
}

// Definición del modelo
DetallePedido.init({
  id_detalle_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Asumido que el ID es autoincremental
    allowNull: false,
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre_producto: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  codigo_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  opciones_adicionales: {
    type: DataTypes.ENUM('Vino', 'Chocolates', 'Peluche'),
    allowNull: false,
  },
  dedicatoria: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  tableName: 'Detalle_Pedido',
  timestamps: false,
  underscored: false,
});

DetallePedido.belongsTo(Pedido, { foreignKey: 'id_pedido', onDelete: 'CASCADE' });

export default DetallePedido;
