import Envio from "../models/Envio.js";

class EnvioController {
  // Crear un nuevo envío
  static async createEnvio(req, res) {
    const { fecha_envio, estado_envio, pedido_id } = req.body;
    try {
      const message = await Envio.createEnvio(fecha_envio, estado_envio, pedido_id);
      res.status(201).json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear envío', error });
    }
  }

  // Obtener todos los envíos
  static async getAllEnvios(req, res) {
    try {
      const envios = await Envio.getAllEnvios();
      res.json(envios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener envíos', error });
    }
  }

  // Obtener un envío por ID
  static async getEnvioById(req, res) {
    const { id } = req.params;
    try {
      const envio = await Envio.getEnvioById(id);
      if (envio.length > 0) {
        res.json(envio[0]);
      } else {
        res.status(404).json({ message: 'Envío no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener envío por ID', error });
    }
  }

  // Actualizar un envío por ID
  static async updateEnvio(req, res) {
    const { id } = req.params;
    const { fecha_envio, estado_envio, pedido_id } = req.body;
    try {
      const message = await Envio.updateEnvio(id, fecha_envio, estado_envio, pedido_id);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar envío', error });
    }
  }

  // Eliminar un envío por ID
  static async deleteEnvio(req, res) {
    const { id } = req.params;
    try {
      const message = await Envio.deleteEnvio(id);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar envío', error });
    }
  }
}

export default EnvioController;
