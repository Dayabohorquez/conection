import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class OpcionAdicional extends Model {
  // Método para crear una nueva opción adicional
  static async crear(opcion_adicional, precio_adicional) {
    try {
      await sequelize.query(
        'CALL CrearOpcionAdicional(:opcion_adicional, :precio_adicional)',
        {
          replacements: { opcion_adicional, precio_adicional },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Opción adicional creada exitosamente.' };
    } catch (error) {
      console.error(`Error al crear opción adicional: ${error}`);
      throw error;
    }
  }

  // Método para obtener todas las opciones adicionales
  static async obtenerOpciones() {
    try {
      const opciones = await sequelize.query(
        'CALL ObtenerOpcionesAdicionales()',
        { type: QueryTypes.RAW }
      );
      return opciones;
    } catch (error) {
      console.error(`Error al obtener opciones adicionales: ${error}`);
      throw error;
    }
  }

  // Método para actualizar una opción adicional por ID
  static async actualizar(id_opcion, nueva_opcion_adicional, nuevo_precio_adicional) {
    try {
      await sequelize.query(
        'CALL ActualizarOpcionAdicional(:id_opcion, :nueva_opcion_adicional, :nuevo_precio_adicional)',
        {
          replacements: { id_opcion, nueva_opcion_adicional, nuevo_precio_adicional },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Opción adicional actualizada exitosamente.' };
    } catch (error) {
      console.error(`Error al actualizar opción adicional: ${error}`);
      throw error;
    }
  }

  // Método para eliminar una opción adicional por ID
  static async eliminar(id_opcion) {
    try {
      await sequelize.query(
        'CALL EliminarOpcionAdicional(:id_opcion)',
        { replacements: { id_opcion }, type: QueryTypes.RAW }
      );
      return { message: 'Opción adicional eliminada exitosamente.' };
    } catch (error) {
      console.error(`Error al eliminar opción adicional: ${error}`);
      throw error;
    }
  }
}

// Definición del modelo
OpcionAdicional.init({
  id_opcion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  opcion_adicional: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio_adicional: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'Opcion_Adicional',
  timestamps: false,
  underscored: false,
});

export default OpcionAdicional;
