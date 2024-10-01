import Envio from "../models/Envio.js";

class EnvioController {
  // Crear un nuevo envío
  static async createEnvio(req, res) {
    const { fecha_envio, pedido_id } = req.body;

    try {
        const message = await Envio.createEnvio(fecha_envio, pedido_id);
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

  static async getEnvioById(req, res) {
    if (!req.params || !req.params.id) {
      return res.status(400).json({ message: 'ID no proporcionado en los parámetros' });
    }

    const { id } = req.params;
    console.log(`Consultando ID: ${id}`);

    try {
      const envio = await Envio.getEnvioById(id);
      console.log('Resultado de la consulta:', envio);

      if (envio && envio.idEnvio) { // Verifica que `envio` tenga `idEnvio`
        res.json(envio);
      } else {
        res.status(404).json({ message: 'Envío no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener envío por ID:', error);
      res.status(500).json({ message: 'Error al obtener envío por ID', error });
    }
  }

  // Actualizar un envío por ID
  static async updateEnvio(req, res) {
    const { id } = req.params;
    const { fecha_envio, pedido_id } = req.body;

    try {
      const message = await Envio.updateEnvio(id, fecha_envio, pedido_id);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar envío', error });
    }
  }

  // En el controlador EnvioController
  static async updateEstadoEnvio(req, res) {
    const { id } = req.params;
    const { estado_envio } = req.body;

    try {
      const message = await Envio.cambiarEstadoEnvio(id, estado_envio);
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el estado del envío', error });
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
