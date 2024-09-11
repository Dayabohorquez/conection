import DetallePedido from '../models/Detallepedido.js';

class DetallePedidoController {
  // Crear un nuevo detalle de pedido
  static async createDetallePedido(req, res) {
    const { id_pedido, nombre_producto, codigo_producto, precio, direccion, cantidad, opciones_adicionales, dedicatoria } = req.body;
    try {
      const message = await DetallePedido.createDetallePedido(id_pedido, nombre_producto, codigo_producto, precio, direccion, cantidad, opciones_adicionales, dedicatoria);
      res.status(201).json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear detalle de pedido', error });
    }
  }

  // Obtener todos los detalles de pedidos
  static async getAllDetallesPedidos(req, res) {
    try {
      const detallesPedidos = await DetallePedido.getAllDetallesPedidos();
      res.json(detallesPedidos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener detalles de pedidos', error });
    }
  }

  // Obtener un detalle de pedido por ID
  static async getDetallePedidoById(req, res) {
    const { id } = req.params;
    try {
      const detallePedido = await DetallePedido.getDetallePedidoById(id);
      if (detallePedido.length > 0) {
        res.json(detallePedido[0]);
      } else {
        res.status(404).json({ message: 'Detalle de pedido no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener detalle de pedido por ID', error });
    }
  }

  // Actualizar un detalle de pedido por ID
  static async updateDetallePedido(req, res) {
    const { id } = req.params;
    const { id_pedido, nombre_producto, codigo_producto, precio, direccion, cantidad, opciones_adicionales, dedicatoria } = req.body;
    try {
      const message = await DetallePedido.updateDetallePedido(id, id_pedido, nombre_producto, codigo_producto, precio, direccion, cantidad, opciones_adicionales, dedicatoria);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar detalle de pedido', error });
    }
  }

  // Eliminar un detalle de pedido por ID
  static async deleteDetallePedido(req, res) {
    const { id } = req.params;
    try {
      const message = await DetallePedido.deleteDetallePedido(id);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar detalle de pedido', error });
    }
  }
}

export default DetallePedidoController;
