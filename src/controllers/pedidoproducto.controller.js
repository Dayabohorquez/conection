import PedidoProducto from "../models/PedidoProducto.js";

class PedidoProductoController {
  // Eliminar un pedido y sus productos asociados
  static async eliminarPedido(req, res) {
    const { pedidoId } = req.params;
    try {
      const message = await PedidoProducto.eliminarPedido(pedidoId);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar pedido', error });
    }
  }

  // Actualizar un pedido
  static async actualizarPedido(req, res) {
    const { pedidoId } = req.params;
    const updatedData = req.body;

    try {
      const message = await PedidoProducto.actualizarPedido(pedidoId, updatedData);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar pedido', error });
    }
  }
}

export default PedidoProductoController;
