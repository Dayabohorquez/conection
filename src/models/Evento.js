import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";

class Evento extends Model {
  // Método para crear un nuevo evento
  static async createEvento(nombre_evento, foto_evento, foto_eventoURL) {
    try {
      await sequelize.query(
        'CALL AddEvento(:nombre_evento, :foto_evento, :foto_eventoURL)',
        {
          replacements: { nombre_evento, foto_evento, foto_eventoURL },
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
      const eventos = await sequelize.query('CALL ObtenerEventos()', { type: QueryTypes.RAW });
      return eventos;
    } catch (error) {
      console.error(`Unable to find all eventos: ${error}`);
      throw error;
    }
  }

  // Método para obtener un evento por ID
  static async getEventoById(id_evento) {
    try {
      const [resultado] = await sequelize.query(
        'CALL GetEventoById(:id_evento)',
        {
          replacements: { id_evento },
          type: QueryTypes.RAW
        }
      );
      return resultado || null;
    } catch (error) {
      console.error(`Unable to find evento by ID: ${error}`);
      throw error;
    }
  }

  // Método para actualizar un evento por ID
  static async updateEvento(id_evento, nombre_evento, foto_evento, foto_eventoURL) {
    try {
        await sequelize.query(
            'CALL UpdateEvento(:id_evento, :nombre_evento, :foto_evento, :foto_eventoURL)',
            {
                replacements: { id_evento, nombre_evento, foto_evento, foto_eventoURL },
                type: QueryTypes.RAW,
            }
        );
        return { message: 'Evento actualizado exitosamente' };
    } catch (error) {
        console.error(`Unable to update evento: ${error}`);
        throw error;
    }
}

  // Método para eliminar un evento por ID
  static async deleteEvento(id_evento) {
    try {
      await sequelize.query(
        'CALL DeleteEvento(:id_evento)',
        {
          replacements: { id_evento },
          type: QueryTypes.RAW,
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
  },
  foto_evento: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  foto_eventoURL: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'Evento',
  timestamps: false,
  underscored: false,
});

export default Evento;
