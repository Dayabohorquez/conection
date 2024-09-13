import HistorialPedido from "../models/HistorialPedido.js";

class HistorialPedidoController {
  // Crear un nuevo historial de pedido
  static async createHistorial(req, res) {
    const { id_pedido, estado_pedido } = req.body; // Ajusta las claves aquí para que coincidan con las de la solicitud JSON
    try {
      const message = await HistorialPedido.createHistorial(id_pedido, estado_pedido);
      res.status(201).json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear historial de pedido', error });
    }
  }

  // Obtener todos los registros del historial
  static async getAllHistorial(req, res) {
    try {
      const historial = await HistorialPedido.getAllHistorial();
      res.json(historial);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener historial de pedidos', error });
    }
  }

  // Obtener historial por ID de pedido
  static async getHistorialByPedidoId(req, res) {
    const { pedidoId } = req.params;
    try {
      const historial = await HistorialPedido.getHistorialByPedidoId(pedidoId);
      res.json(historial);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener historial por ID de pedido', error });
    }
  }
}

export default HistorialPedidoController;
