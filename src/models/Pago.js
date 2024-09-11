import { DataTypes, QueryTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class Pago extends Model {
  static async createPago(pago) {
    try {
      await sequelize.query(
        'CALL CrearPago(:id_pago, :nombre_pago, :fecha_pago, :iva, :metodo_pago, :subtotal_pago, :total_pago)',
        {
          replacements: pago,
          type: QueryTypes.RAW
        }
      );
      return { message: 'Pago creado exitosamente' };
    } catch (error) {
      console.error(`Unable to create pago: ${error}`);
      throw error;
    }
  }

  static async getPagos() {
    try {
      const pagos = await sequelize.query('CALL ObtenerPagos()', { type: QueryTypes.RAW });
      return pagos;
    } catch (error) {
      console.error(`Unable to find all pagos: ${error}`);
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
          replacements: { id, ...updated_pago },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Pago actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update pago: ${error}`);
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
