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

  static async obtenerHistorial(req, res) {
    const { documento } = req.params; // Asegúrate de que estás pasando el documento en los parámetros de la ruta

    try {
      const historial = await Pedido.obtenerHistorial(documento);
      return res.status(200).json(historial);
    } catch (error) {
      console.error('Error en obtenerHistorial (controlador):', error);
      return res.status(500).json({ message: 'Error al obtener el historial de pedidos.' });
    }
  }

  static async cancelarPedido(req, res) {
        const { id_pedido } = req.params; // Asegúrate de que estás pasando el id del pedido en los parámetros de la ruta

        try {
            await Pedido.cancelarPedido(id_pedido);
            return res.status(200).json({ message: 'Pedido cancelado con éxito.' });
        } catch (error) {
            console.error('Error en cancelarPedido (controlador):', error);
            return res.status(500).json({ message: 'Error al cancelar el pedido.' });
        }
    }

  static async realizarPedido(req, res) {
    const { documento, metodo_pago, subtotal_pago, total_pago, items, direccion_envio } = req.body;

    try {
      // Validación de datos
      if (
        documento === undefined ||
        metodo_pago === undefined ||
        subtotal_pago === undefined ||
        total_pago === undefined ||
        !Array.isArray(items) ||
        items.length === 0 ||
        !direccion_envio
      ) {
        return res.status(400).json({
          mensaje: 'Faltan datos requeridos para realizar el pedido.',
        });
      }

      // Verificar que todos los items tengan la estructura correcta
      for (const item of items) {
        if (!item.id_producto || !item.cantidad || !item.precio_unitario) {
          return res.status(400).json({
            mensaje: 'Cada item debe contener id_producto, cantidad y precio_unitario.',
          });
        }
        if (typeof item.cantidad !== 'number' || item.cantidad <= 0) {
          return res.status(400).json({
            mensaje: 'La cantidad debe ser un número positivo.',
          });
        }
        if (typeof item.precio_unitario !== 'number' || item.precio_unitario < 0) {
          return res.status(400).json({
            mensaje: 'El precio unitario debe ser un número no negativo.',
          });
        }
        if (item.opcion_adicional && typeof item.opcion_adicional !== 'string') {
          return res.status(400).json({
            mensaje: 'La opción adicional debe ser una cadena si se proporciona.',
          });
        }
      }

      // Llamada al modelo para realizar el pedido
      const resultado = await Pedido.realizarPedido(documento, metodo_pago, subtotal_pago, total_pago, items, direccion_envio);

      return res.status(201).json({
        mensaje: 'Pedido realizado con éxito',
        resultado,
      });
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
      return res.status(500).json({
        mensaje: 'Error al realizar el pedido. Por favor, inténtelo de nuevo más tarde.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // Crear un ítem de pedido
  static async crearPedidoItem(req, res) {
    const { id_pedido } = req.params; // ID del pedido
    const pedidoItemData = req.body; // Datos del ítem de pedido

    try {
      // Validación de datos
      if (!pedidoItemData.id_producto || !pedidoItemData.cantidad || !pedidoItemData.precio_unitario) {
        return res.status(400).json({
          mensaje: 'El ítem de pedido debe contener id_producto, cantidad y precio_unitario.',
        });
      }
      if (typeof pedidoItemData.cantidad !== 'number' || pedidoItemData.cantidad <= 0) {
        return res.status(400).json({
          mensaje: 'La cantidad debe ser un número positivo.',
        });
      }
      if (typeof pedidoItemData.precio_unitario !== 'number' || pedidoItemData.precio_unitario < 0) {
        return res.status(400).json({
          mensaje: 'El precio unitario debe ser un número no negativo.',
        });
      }
      if (pedidoItemData.opcion_adicional && typeof pedidoItemData.opcion_adicional !== 'string') {
        return res.status(400).json({
          mensaje: 'La opción adicional debe ser una cadena si se proporciona.',
        });
      }

      pedidoItemData.id_pedido = id_pedido; // Asignar ID del pedido a los datos del ítem
      const result = await Pedido.crearPedidoItem(pedidoItemData);
      
      return res.status(201).json({
        mensaje: 'Ítem de pedido creado con éxito',
        result,
      });
    } catch (error) {
      console.error('Error al crear ítem de pedido:', error);
      return res.status(500).json({
        message: 'Error al crear ítem de pedido',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
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
