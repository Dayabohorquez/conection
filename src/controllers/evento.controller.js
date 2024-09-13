import Evento from "../models/Evento.js";

class EventoController {
  // Crear un nuevo evento
  static async createEvento(req, res) {
    const { nombre } = req.body;
    try {
      const message = await Evento.createEvento(nombre);
      res.status(201).json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear evento', error });
    }
  }

  // Obtener todos los eventos
  static async getAllEventos(req, res) {
    try {
      const eventos = await Evento.getAllEventos();
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener eventos', error });
    }
  }

  // Obtener un evento por ID
  static async getEventoById(req, res) {
    const { id } = req.params;
    try {
      const evento = await Evento.getEventoById(id);
      if (evento.length > 0) {
        res.json(evento[0]);
      } else {
        res.status(404).json({ message: 'Evento no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener evento por ID', error });
    }
  }

  // Actualizar un evento por ID
  static async updateEvento(req, res) {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
      const message = await Evento.updateEvento(id, nombre);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar evento', error });
    }
  }

  // Eliminar un evento por ID
  static async deleteEvento(req, res) {
    const { id } = req.params;
    try {
      const message = await Evento.deleteEvento(id);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar evento', error });
    }
  }
}

export default EventoController;