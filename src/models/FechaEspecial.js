import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class FechaEspecial extends Model {
  // Método para crear una nueva fecha especial
  static async createFechaEspecial({ nombre_fecha_especial }) {
    try {
      const query = `
        CALL CrearFechaEspecial(:nombre_fecha_especial);
      `;
      const replacements = { nombre_fecha_especial };
      await sequelize.query(query, {
        replacements,
        type: QueryTypes.RAW,
      });
      return { message: 'Fecha especial creada exitosamente' };
    } catch (error) {
      console.error(`Unable to create fecha especial: ${error}`);
      throw error;
    }
  }

  // Método para obtener todas las fechas especiales
  static async getAllFechasEspeciales() {
    try {
      const fechasEspeciales = await sequelize.query('CALL ObtenerFechasEspeciales()', { type: QueryTypes.RAW });
      return fechasEspeciales;
    } catch (error) {
      console.error(`Unable to find all fechas especiales: ${error}`);
      throw error;
    }
  }

  // Método para obtener una fecha especial por ID
  static async getFechaEspecialById(id) {
    try {
      const fechaEspecial = await sequelize.query('CALL ObtenerFechaEspecialPorId(:id)', {
        replacements: { id },
        type: QueryTypes.RAW,
      });
      return fechaEspecial;
    } catch (error) {
      console.error(`Unable to find fecha especial by ID: ${error}`);
      throw error;
    }
  }

  // Método para actualizar una fecha especial
  static async actualizarFechaEspecial({ id_fecha_especial, nombre_fecha_especial }) {
    try {
      await sequelize.query(
        'CALL ActualizarFechaEspecial(:p_id_fecha_especial, :p_nombre_fecha_especial)',
        {
          replacements: { p_id_fecha_especial: id_fecha_especial, p_nombre_fecha_especial: nombre_fecha_especial },
          type: QueryTypes.RAW,
        }
      );
      return { message: 'Fecha especial actualizada exitosamente' };
    } catch (error) {
      console.error(`Unable to update fecha especial: ${error}`);
      throw error;
    }
  }

  // Método para eliminar una fecha especial
  static async deleteFechaEspecial(id) {
    try {
      await sequelize.query('CALL EliminarFechaEspecial(:id)', {
        replacements: { id },
        type: QueryTypes.RAW,
      });
      return { message: 'Fecha especial eliminada exitosamente' };
    } catch (error) {
      console.error(`Unable to delete fecha especial: ${error}`);
      throw error;
    }
  }
}

// Definición del modelo
FechaEspecial.init({
  id_fecha_especial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nombre_fecha_especial: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'Fecha_Especial',
  timestamps: false,
  underscored: false,
});

export default FechaEspecial;
