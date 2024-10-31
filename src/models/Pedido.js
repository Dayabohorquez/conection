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

  static async obtenerHistorial(documento) {
    try {
      const result = await sequelize.query(
        'CALL ObtenerHistorialPedidos(:documento)',
        {
          replacements: { documento },
          type: QueryTypes.RAW,
        }
      );

      return result; // Devuelve el resultado del procedimiento
    } catch (error) {
      console.error('Error en obtenerHistorial (modelo):', error);
      throw error;
    }
  }

  static async cancelarPedido(id_pedido) {
    try {
        const result = await sequelize.query(
            'CALL CancelarPedido(:id_pedido)',
            {
                replacements: { id_pedido },
                type: QueryTypes.RAW,
            }
        );
        return result; // Devuelve el resultado del procedimiento
    } catch (error) {
        console.error('Error al cancelar el pedido (modelo):', error);
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

  static async realizarPedido(documento, metodo_pago, subtotal_pago, total_pago, items, direccion_envio) {
    // Validación de parámetros
    if (!documento || typeof documento !== 'number') {
      throw new Error('El documento es requerido y debe ser un número.');
    }
    if (!metodo_pago || !['Nequi', 'Bancolombia', 'Efectivo'].includes(metodo_pago)) {
      throw new Error('El método de pago es requerido y debe ser uno de: Nequi, Bancolombia, Efectivo.');
    }
    if (subtotal_pago === undefined || typeof subtotal_pago !== 'number') {
      throw new Error('El subtotal de pago es requerido y debe ser un número.');
    }
    if (total_pago === undefined || typeof total_pago !== 'number') {
      throw new Error('El total de pago es requerido y debe ser un número.');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Los items son requeridos y deben ser un arreglo.');
    }
    if (!direccion_envio || typeof direccion_envio !== 'string') {
      throw new Error('La dirección de envío es requerida y debe ser una cadena.');
    }

    // Validar cada item en el arreglo
    for (const item of items) {
      if (!item.id_producto || !item.cantidad || !item.precio_unitario) {
        throw new Error('Cada item debe contener id_producto, cantidad y precio_unitario.');
      }
      if (typeof item.cantidad !== 'number' || item.cantidad <= 0) {
        throw new Error('La cantidad debe ser un número positivo.');
      }
      if (typeof item.precio_unitario !== 'number' || item.precio_unitario < 0) {
        throw new Error('El precio unitario debe ser un número no negativo.');
      }
      if (item.opcion_adicional && typeof item.opcion_adicional !== 'string') {
        throw new Error('La opción adicional debe ser una cadena si se proporciona.');
      }
    }

    try {
      const result = await sequelize.query(
        'CALL RealizarPedido(:documento, :metodo_pago, :subtotal_pago, :total_pago, :items, :direccion_envio)',
        {
          replacements: {
            documento,
            metodo_pago,
            subtotal_pago,
            total_pago,
            items: JSON.stringify(items.map(item => ({
              id_producto: item.id_producto,
              cantidad: item.cantidad,
              precio_unitario: item.precio_unitario,
              dedicatoria: item.dedicatoria || null,  // Asigna null si no hay dedicatoria
              opcion_adicional: item.opcion_adicional || null, // Asigna null si no hay opción
            }))),
            direccion_envio,
          },
          type: QueryTypes.RAW,
          nest: true,
        }
      );

      return result;
    } catch (error) {
      console.error('Error en realizarPedido (modelo):', error);
      throw new Error('Error al realizar el pedido. Por favor, inténtelo de nuevo más tarde.');
    }
  }

  static async crearPedidoItem(pedidoItemData) {
    const { id_pedido, id_producto, cantidad, precio_unitario, opcion_adicional, dedicatoria } = pedidoItemData;

    try {
      const result = await sequelize.query(
        'CALL CrearPedidoItem(:id_pedido, :id_producto, :cantidad, :precio_unitario, :opcion_adicional, :dedicatoria)',
        {
          replacements: {
            id_pedido,
            id_producto,
            cantidad,
            precio_unitario,
            opcion_adicional: opcion_adicional || null,  // Asegúrate de que sea null si no hay opción
            dedicatoria: dedicatoria || null,  // Asegúrate de que sea null si no hay dedicatoria
          },
          type: QueryTypes.RAW,
        }
      );

      return result; // Devuelve el resultado del procedimiento
    } catch (error) {
      console.error('Error en crearPedidoItem (modelo):', error);
      throw new Error('Error al crear el item del pedido. Por favor, inténtelo de nuevo más tarde.');
    }
  }

  static async obtenerItemsPorPedido(idPedido) {
    try {
      const items = await sequelize.query('CALL ObtenerItemsPorPedido(:id_pedido)', {
        replacements: { id_pedido: idPedido },
        type: QueryTypes.RAW,
      });
      return items; // Devuelve la lista de ítems para el pedido especificado
    } catch (error) {
      console.error(`Unable to fetch items for pedido: ${error}`);
      throw error;
    }
  }

  static async actualizarPedido(idPedido, updatedData) {
    try {
      if (isNaN(idPedido)) {
        throw new Error('ID del pedido no válido.');
      }

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
      const estadosValidos = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
      if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error('Estado no válido. Debe ser uno de: ' + estadosValidos.join(', '));
      }

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
