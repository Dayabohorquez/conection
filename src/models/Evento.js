import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";

class Evento extends Model {
  // Método para crear un nuevo evento
  static async createEvento(nombre) {
    try {
      await sequelize.query(
        'CALL CrearEvento(:nombre)', 
        {
          replacements: { nombre },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Evento creado exitosamente' };
    } catch (error) {
      console.error(`Unable to create evento: ${error}`);
      throw error;
    }
  }

  // Método para obtener todos los eventos
  static async getAllEventos() {
    try {
      const eventos = await sequelize.query(
        'CALL ObtenerEventos()', 
        { type: QueryTypes.RAW }
      );
      return eventos[0]; // En MySQL, los resultados se devuelven en un array
    } catch (error) {
      console.error(`Unable to find all eventos: ${error}`);
      throw error;
    }
  }

  // Método para obtener un evento por ID
  static async getEventoById(id) {
    try {
      const evento = await sequelize.query(
        'CALL ObtenerEventoPorId(:id)', 
        {
          replacements: { id },
          type: QueryTypes.RAW
        }
      );
      return evento[0]; // En MySQL, los resultados se devuelven en un array
    } catch (error) {
      console.error(`Unable to find evento by ID: ${error}`);
      throw error;
    }
  }

  // Método para actualizar un evento por ID
  static async updateEvento(id, nombre) {
    try {
      await sequelize.query(
        'CALL ActualizarEvento(:id, :nombre)', 
        {
          replacements: { id, nombre },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Evento actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update evento: ${error}`);
      throw error;
    }
  }

  // Método para eliminar un evento por ID
  static async deleteEvento(id) {
    try {
      await sequelize.query(
        'CALL EliminarEvento(:id)', 
        {
          replacements: { id },
          type: QueryTypes.RAW
        }
      );
      return { message: 'Evento eliminado exitosamente' };
    } catch (error) {
      console.error(`Unable to delete evento: ${error}`);
      throw error;
    }
  }
}

// Definición del modelo
Evento.init({
  id_evento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nombre_evento: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  tableName: 'Evento',
  timestamps: false,
  underscored: false,
});

export default Evento;
