import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Carrito from './Carrito.js';
import Pago from './Pago.js';
import Usuario from './Usuario.js';

class Pedido extends Model {
  static async obtenerPedidos() {
    try {
      const pedidos = await sequelize.query('CALL ObtenerPedidos()', { type: QueryTypes.RAW });
      return pedidos; // Devuelve el primer elemento del array resultante
    } catch (error) {
      console.error(`Unable to fetch pedidos: ${error}`);
      throw error;
    }
  }

  static async obtenerPedidoPorId(idPedido) {
    try {
      const pedido = await sequelize.query('CALL ObtenerPedidoPorId(:id_pedido)', {
        replacements: { id_pedido: idPedido },
        type: QueryTypes.RAW,
      });
      return pedido[0]; // Devuelve el primer elemento del array resultante
    } catch (error) {
      console.error(`Unable to find pedido by id: ${error}`);
      throw error;
    }
  }

  static async crearPedido(pedidoData) {
    const { fecha_pedido, total_pagado, documento, pago_id } = pedidoData;

    try {
      const result = await sequelize.query(
        'CALL CrearPedido(:fecha_pedido, :total_pagado, :documento, :pago_id)',
        {
          replacements: {
            fecha_pedido,
            total_pagado,
            documento,
            pago_id,
          },
          type: QueryTypes.RAW,
        }
      );

      return result; // Devuelve el ID del nuevo pedido
    } catch (error) {
      console.error('Error en crearPedido (modelo):', error);
      throw error;
    }
  }

  static async actualizarPedido(idPedido, updatedData) {
    try {
      // Verifica que idPedido sea un número
      if (isNaN(idPedido)) {
        throw new Error('ID del pedido no válido.');
      }

      // Llamar al procedimiento almacenado
      const result = await sequelize.query(
        'CALL ActualizarPedido(:p_id_pedido, :p_fecha_pedido, :p_total_pagado, :p_documento, :p_pago_id)',
        {
          replacements: {
            p_id_pedido: idPedido,
            p_fecha_pedido: updatedData.fecha_pedido,
            p_total_pagado: updatedData.total_pagado,
            p_documento: updatedData.documento,
            p_pago_id: updatedData.pago_id,
          },
          type: QueryTypes.RAW,
        }
      );

      return { message: 'Pedido actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update pedido: ${error}`);
      throw error;
    }
  }

  static async actualizarEstadoPedido(idPedido, nuevoEstado) {
    try {
      // Validar que el estado sea uno de los válidos
      const estadosValidos = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
      if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error('Estado no válido. Debe ser uno de: ' + estadosValidos.join(', '));
      }

      // Llamar al procedimiento almacenado
      const result = await sequelize.query(
        'CALL ActualizarEstadoPedido(:p_id_pedido, :nuevo_estado)',
        {
          replacements: { p_id_pedido: idPedido, nuevo_estado: nuevoEstado },
          type: QueryTypes.RAW,
        }
      );

      return { message: 'Estado del pedido actualizado exitosamente' };
    } catch (error) {
      console.error('Error en actualizarEstadoPedido (modelo):', error.message);
      throw error; // Propagar el error
    }
  }
}

// Inicialización del modelo
Pedido.init({
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  fecha_pedido: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado_pedido: {
    type: DataTypes.ENUM('Pendiente', 'Enviado', 'Entregado', 'Cancelado'),
    defaultValue: 'Pendiente',
  },
  total_pagado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'Pedido',
  timestamps: false,
});

// Definición de relaciones
Pedido.belongsTo(Usuario, { foreignKey: 'documento' });
Pedido.belongsTo(Pago, { foreignKey: 'pago_id' });
Pedido.belongsTo(Carrito, { foreignKey: 'id_carrito' });

export default Pedido;
