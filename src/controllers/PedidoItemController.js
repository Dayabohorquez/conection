import PedidoItem from '../models/Pedido_Item.js';

class PedidoItemController {
  // Crear un nuevo item de pedido
  static async crearPedidoItem(req, res) {
    const { id_pedido, id_producto, cantidad, precio_unitario, opcion_adicional } = req.body;

    try {
      const result = await PedidoItem.createPedidoItem(id_pedido, id_producto, cantidad, precio_unitario, opcion_adicional);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error al crear item de pedido:', error);
      res.status(500).json({ message: 'Error al crear item de pedido', error });
    }
  }
  
  static async obtenerItemsPorPedido(req, res) {
    const { id_pedido } = req.params; // Extraer id_pedido de los parámetros

    try {
      const items = await PedidoItem.getItemsByPedido(id_pedido); // Llamar al método del modelo
      res.status(200).json(items); // Responder con los items encontrados
    } catch (error) {
      console.error('Error al obtener items de pedido:', error);
      res.status(500).json({ message: 'Error al obtener items de pedido', error }); // Responder con un error
    }
  }

  // Obtener un item de pedido por ID
  static async obtenerPedidoItemPorId(req, res) {
    const { id_pedido_item } = req.params;

    try {
      const item = await PedidoItem.getPedidoItemById(id_pedido_item);
      res.status(200).json(item);
    } catch (error) {
      console.error('Error al obtener item de pedido por ID:', error);
      res.status(500).json({ message: 'Error al obtener item de pedido por ID', error });
    }
  }

  // Actualizar un item de pedido
  static async actualizarPedidoItem(req, res) {
    const { id_pedido_item } = req.params;
    const { cantidad, precio_unitario, opcion_adicional } = req.body;

    try {
      const result = await PedidoItem.updatePedidoItem(id_pedido_item, cantidad, precio_unitario, opcion_adicional);
      res.json(result);
    } catch (error) {
      console.error('Error al actualizar item de pedido:', error);
      res.status(500).json({ message: 'Error al actualizar item de pedido', error });
    }
  }

  // Eliminar un item de pedido
  static async eliminarPedidoItem(req, res) {
    const { id_pedido_item } = req.params;

    try {
      const result = await PedidoItem.deletePedidoItem(id_pedido_item);
      res.json(result);
    } catch (error) {
      console.error('Error al eliminar item de pedido:', error);
      res.status(500).json({ message: 'Error al eliminar item de pedido', error });
    }
  }
}

export default PedidoItemController;
