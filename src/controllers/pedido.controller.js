import Pedido from "../models/Pedido.js";

class PedidoController {
  // Obtener todos los pedidos
  static async obtenerPedidos(req, res) {
    try {
      const pedidos = await Pedido.obtenerPedidos();
      res.status(200).json(pedidos); // Responde con la lista de pedidos
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      res.status(500).json({ message: 'Error al obtener pedidos', error });
    }
  }

  // Obtener un pedido por ID
  static async obtenerPedidoPorId(req, res) {
    const { id } = req.params;

    try {
      const pedido = await Pedido.obtenerPedidoPorId(id);

      if (!pedido || pedido.length === 0) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      return res.status(200).json(pedido);
    } catch (error) {
      console.error('Error al obtener el pedido:', error);
      return res.status(500).json({ message: 'Error al obtener el pedido', error });
    }
  }

  static async crearPedido(req, res) {
    try {
      const pedidoData = req.body; // Asegúrate de que los datos se envíen en el cuerpo de la solicitud
      const result = await Pedido.crearPedido(pedidoData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error al crear pedido:', error);
      res.status(500).json({ message: 'Error al crear pedido', error });
    }
  }

  static async actualizarPedido(req, res) {
    const idPedido = req.params.id_pedido; // Obtén el ID del pedido desde los parámetros de la URL
    const updatedData = req.body; // Datos de actualización

    try {
      const result = await Pedido.actualizarPedido(idPedido, updatedData);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
    }
  }

  static async cambiarEstadoPedido(req, res) {
    const idPedido = parseInt(req.params.id_pedido, 10); // Obtén el ID del pedido desde los parámetros de la URL
    const { nuevo_estado } = req.body; // Nuevo estado del pedido

    // Verificar que el nuevo estado fue proporcionado
    if (!nuevo_estado) {
      return res.status(400).json({ message: 'El nuevo estado es requerido.' });
    }

    try {
      const result = await Pedido.actualizarEstadoPedido(idPedido, nuevo_estado);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al cambiar estado del pedido:', error);
      if (error.message.includes('Estado no válido')) {
        return res.status(400).json({ message: error.message });
      } else if (error.message.includes('Pedido no existe')) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error al cambiar estado del pedido', error: error.message });
    }
  }
}

export default PedidoController;
