import { DataTypes, Model, QueryTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class Pago extends Model {
  static async crearPago(nombre_pago, fecha_pago, iva, metodo_pago, subtotal_pago, total_pago) {
    try {
      const [result] = await sequelize.query(`
            CALL CrearPago(:nombre_pago, :fecha_pago, :iva, :metodo_pago, :subtotal_pago, :total_pago);
        `, {
        replacements: {
          nombre_pago,
          fecha_pago: new Date(fecha_pago), // Asegúrate de que esto sea un objeto Date
          iva,
          metodo_pago,
          subtotal_pago,
          total_pago
        },
        type: QueryTypes.RAW
      });

      console.log('Resultado del procedimiento:', result); // Log para verificar la estructura

      // Acceso directo al id_pago
      if (!result || typeof result !== 'object' || !result.id_pago) {
        throw new Error('El procedimiento no devolvió un resultado válido.');
      }

      return result.id_pago; // Accede directamente al id_pago
    } catch (error) {
      throw new Error(`Error en crearPago (modelo): ${error.message}`);
    }
  }

  static async getPagos() {
    try {
      const pagos = await sequelize.query('CALL ObtenerPagos()', { type: QueryTypes.RAW });
      return pagos;
    } catch (error) {
      console.error(`Unable to find all pagos: ${error.message}`);
      throw error;
    }
  }

  static async getPagoById(id) {
    try {
      const pago = await sequelize.query('CALL ObtenerPagoPorId(:id)', {
        replacements: { id },
        type: QueryTypes.RAW
      });
      return pago;
    } catch (error) {
      console.error(`Unable to find pago by id: ${error}`);
      throw error;
    }
  }

  static async updatePago(id, updated_pago) {
    try {
      await sequelize.query(
        'CALL ActualizarPago(:id_pago, :nombre_pago, :fecha_pago, :iva, :metodo_pago, :subtotal_pago, :total_pago)',
        {
          replacements: {
            id_pago: id,
            nombre_pago: updated_pago.nombre_pago,
            fecha_pago: updated_pago.fecha_pago,
            iva: updated_pago.iva,
            metodo_pago: updated_pago.metodo_pago,
            subtotal_pago: updated_pago.subtotal_pago,
            total_pago: updated_pago.total_pago
          },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Pago actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update pago: ${error}`);
      throw error;
    }
  }

  static async updateEstadoPago(id, estado) {
    try {
      await sequelize.query(
        'CALL ActualizarEstadoPago(:id_pago, :estado_pago)',
        {
          replacements: {
            id_pago: id,
            estado_pago: estado,
          },
          type: QueryTypes.RAW,
        }
      );
      return { message: 'Estado del pago actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update estado of pago: ${error}`);
      throw error;
    }
  }

  static async crearPagoYPedido(pagoData, pedidoData) {
    try {
      const result = await sequelize.query(
        'CALL CrearPagoYPedido(:nombre_pago, :fecha_pago, :iva, :metodo_pago, :subtotal_pago, :total_pago, :fecha_pedido, :total_pagado, :documento, :id_carrito)',
        {
          replacements: {
            nombre_pago: pagoData.nombre_pago,
            fecha_pago: pagoData.fecha_pago,
            iva: pagoData.iva,
            metodo_pago: pagoData.metodo_pago,
            subtotal_pago: pagoData.subtotal_pago,
            total_pago: pagoData.total_pago,
            fecha_pedido: pedidoData.fecha_pedido,
            total_pagado: pedidoData.total_pagado,
            documento: pedidoData.documento,
            id_carrito: pedidoData.id_carrito,
          },
          type: QueryTypes.RAW,
        }
      );

      return result;
    } catch (error) {
      console.error('Error al crear pago y pedido:', error);
      throw error;
    }
  }

  static async deletePago(id) {
    try {
      await sequelize.query('CALL EliminarPago(:id)', {
        replacements: { id },
        type: QueryTypes.RAW
      });
      return { message: 'Pago eliminado exitosamente' };
    } catch (error) {
      console.error(`Unable to delete pago: ${error}`);
      throw error;
    }
  }
}

Pago.init({
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  nombre_pago: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  fecha_pago: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  iva: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  metodo_pago: {
    type: DataTypes.ENUM('Nequi', 'Bancolombia', 'Efectivo'),
    allowNull: false,
  },
  subtotal_pago: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total_pago: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estado_pago: {
    type: DataTypes.ENUM('Exitoso', 'Pendiente', 'Fallido', 'Cancelado'),
    defaultValue: 'Pendiente',
  },
}, {
  sequelize,
  tableName: 'Pago',
  timestamps: false,
  underscored: false,
});

export default Pago;