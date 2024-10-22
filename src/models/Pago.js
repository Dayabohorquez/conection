import { DataTypes, Model, QueryTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Usuario from './Usuario.js';

class Pago extends Model {
  static async crearPago(pagoData) {
    const { documento, fecha_pago, metodo_pago, subtotal_pago, total_pago } = pagoData;

    try {
      const [result] = await sequelize.query(
        `CALL CrearPago(:documento, :fecha_pago, :metodo_pago, :subtotal_pago, :total_pago);`,
        {
          replacements: {
            documento,
            fecha_pago: new Date(fecha_pago), // Asegúrate de que esto sea un objeto Date
            metodo_pago,
            subtotal_pago,
            total_pago
          },
          type: QueryTypes.RAW
        }
      );

      // Asegúrate de que el resultado contenga un ID válido
      if (!result || typeof result !== 'object' || !result.id_pago) {
        throw new Error('El procedimiento no devolvió un resultado válido.');
      }

      return result.id_pago; // Devuelve el ID del nuevo pago
    } catch (error) {
      throw new Error(`Error en crearPago (modelo): ${error.message}`);
    }
  }

  static async obtenerPagos() {
    try {
      const pagos = await sequelize.query('CALL ObtenerPagos()', { type: QueryTypes.RAW });
      return pagos; // Devuelve el primer elemento del array resultante
    } catch (error) {
      console.error(`Unable to find all pagos: ${error.message}`);
      throw error;
    }
  }

  static async obtenerPagoPorId(id) {
    try {
      const pago = await sequelize.query('CALL ObtenerPagoPorId(:id)', {
        replacements: { id },
        type: QueryTypes.RAW
      });
      return pago[0]; // Devuelve el primer elemento del array resultante
    } catch (error) {
      console.error(`Unable to find pago by id: ${error}`);
      throw error;
    }
  }

  static async actualizarPago(id, updatedData) {
    try {
      await sequelize.query(
        'CALL ActualizarPago(:id_pago, :documento, :fecha_pago, :metodo_pago, :subtotal_pago, :total_pago)',
        {
          replacements: {
            id_pago: id,
            documento: updatedData.documento,
            fecha_pago: updatedData.fecha_pago,
            metodo_pago: updatedData.metodo_pago,
            subtotal_pago: updatedData.subtotal_pago,
            total_pago: updatedData.total_pago
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

  static async actualizarEstadoPago(id_pago, estado_pago) {
    try {
      await sequelize.query(
        'CALL ActualizarEstadoPago(:p_id_pago, :p_estado_pago)',
        {
          replacements: { p_id_pago: id_pago, p_estado_pago: estado_pago },
          type: QueryTypes.RAW,
        }
      );
      return { message: 'Estado del pago actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update pago: ${error}`);
      throw error;
    }
  }

  static async eliminarPago(id) {
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

// Inicialización del modelo
Pago.init({
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_pago: {
    type: DataTypes.DATE,
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
});

// Definición de relaciones
Pago.belongsTo(Usuario, { foreignKey: 'documento' });

export default Pago;
