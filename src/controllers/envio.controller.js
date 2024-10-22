import Envio from "../models/Envio.js";

class EnvioController {
  // Obtener todos los envíos
  static async obtenerEnvios(req, res) {
    try {
      const envios = await Envio.getAllEnvios();
      res.status(200).json(envios);
    } catch (error) {
      console.error('Error al obtener envíos:', error);
      res.status(500).json({ message: 'Error al obtener envíos', error });
    }
  }

  // Obtener envío por ID
  static async obtenerEnvioPorId(req, res) {
    const { id_envio } = req.params;
    try {
      const envio = await Envio.getEnvioById(id_envio);
      if (!envio) {
        return res.status(404).json({ message: 'Envío no encontrado' });
      }
      res.status(200).json(envio);
    } catch (error) {
      console.error('Error al obtener envío por ID:', error);
      res.status(500).json({ message: 'Error al obtener envío', error });
    }
  }

  // Crear un nuevo envío
  static async crearEnvio(req, res) {
    const { fecha_envio, pedido_id } = req.body;
    try {
      const result = await Envio.createEnvio(fecha_envio, pedido_id);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error al crear envío:', error);
      res.status(500).json({ message: 'Error al crear envío', error: error.message });
    }
  };

  // Actualizar envío por ID
  static async actualizarEnvio(req, res) {
    const id_envio = req.params.id; // Obtén el id de los parámetros de la ruta
    const { fecha_envio, pedido_id } = req.body;
    try {
      const result = await Envio.updateEnvio(id_envio, fecha_envio, pedido_id);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al actualizar envío:', error);
      res.status(500).json({ message: 'Error al actualizar envío', error: error.message });
    }
  }

  // Cambiar el estado de un envío
  static async cambiarEstadoEnvio(req, res) {
    const idEnvio = req.params.id; // Obtener el ID del envío desde los parámetros de la URL
    const { nuevo_estado } = req.body; // Obtener el nuevo estado del cuerpo de la solicitud

    try {
      const result = await Envio.actualizarEstadoEnvio(idEnvio, nuevo_estado);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al cambiar el estado del envío:', error);
      res.status(500).json({ message: 'Error al cambiar el estado del envío', error });
    }
  }

  static async eliminarEnvio(req, res) {
    const { id_envio } = req.params; // Asegúrate de que estás obteniendo el ID correctamente
    try {
      const result = await Envio.deleteEnvio(id_envio);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al eliminar envío:', error);
      res.status(500).json({ message: 'Error al eliminar envío', error: error.message });
    }
  }
}

export default EnvioController;
