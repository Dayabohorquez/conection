import Pedido from "../models/Pedido.js";
import PedidoItem from "../models/Pedido_Item.js"; // Asegúrate de que este modelo esté definido

class PedidoController {
  // Obtener todos los pedidos
  static async obtenerPedidos(req, res) {
    try {
      const pedidos = await Pedido.obtenerPedidos();
      res.status(200).json(pedidos);
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

  // Crear un pedido
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

  // Actualizar un pedido
  static async actualizarPedido(req, res) {
    const idPedido = req.params.id_pedido;
    const updatedData = req.body;

    try {
      const result = await Pedido.actualizarPedido(idPedido, updatedData);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
    }
  }

  static async realizarPedido(req, res) {
    const { documento, metodo_pago, subtotal_pago, total_pago, items } = req.body;

    // Validar datos
    const missingFields = {
        documento: !documento,
        metodo_pago: !metodo_pago,
        subtotal_pago: subtotal_pago == null,
        total_pago: total_pago == null,
        items: !Array.isArray(items) || items.length === 0,
    };

    if (Object.values(missingFields).some(field => field)) {
        return res.status(400).json({ 
            message: 'Datos incompletos para realizar el pedido.', 
            missingFields 
        });
    }

    // Asegurarse de que cada item tenga la estructura adecuada
    for (const item of items) {
        if (!item.id_producto || !item.cantidad || item.precio_unitario == null) {
            return res.status(400).json({ 
                message: 'Cada item debe tener un id_producto, cantidad y precio_unitario.', 
                item 
            });
        }
    }

    try {
        const resultado = await Pedido.realizarPedido({
            documento,
            metodo_pago,
            subtotal_pago,
            total_pago,
            items,
        });

        return res.status(201).json({
            message: 'Pago y pedido creados exitosamente',
            data: resultado,
        });
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        return res.status(500).json({ message: 'Error al procesar el pedido', error });
    }
}

  // Cambiar el estado de un pedido
  static async cambiarEstadoPedido(req, res) {
    const idPedido = parseInt(req.params.id_pedido, 10);
    const { nuevo_estado } = req.body;

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

  // Crear un ítem de pedido
  static async crearPedidoItem(req, res) {
    const { id_pedido } = req.params; // ID del pedido
    const pedidoItemData = req.body; // Datos del ítem de pedido

    try {
      pedidoItemData.id_pedido = id_pedido; // Asignar ID del pedido a los datos del ítem
      const result = await Pedido.crearPedidoItem(pedidoItemData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error al crear ítem de pedido:', error);
      res.status(500).json({ message: 'Error al crear ítem de pedido', error });
    }
  }

  // Obtener ítems de un pedido
  static async obtenerItemsPorPedido(req, res) {
    const { id_pedido } = req.params;

    try {
      const items = await Pedido.obtenerItemsPorPedido(id_pedido);
      res.status(200).json(items);
    } catch (error) {
      console.error('Error al obtener ítems del pedido:', error);
      res.status(500).json({ message: 'Error al obtener ítems del pedido', error });
    }
  }
}

export default PedidoController;
