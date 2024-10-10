// src/controllers/pedido.controller.js
import path from 'path';
import { fileURLToPath } from 'url';
import Pedido from "../models/Pedido.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PedidoController {
  static async obtenerPedidos(req, res) {
    try {
      const pedidos = await Pedido.obtenerPedidos(); // Llama al método del modelo
      if (!pedidos || pedidos.length === 0) {
        return res.status(404).json({ message: 'No se encontraron pedidos' });
      }
      res.status(200).json(pedidos); // Envía el array directamente
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
    }
  }

  // Obtener un pedido por ID
  static async obtenerPedidoPorId(req, res) {
    const { id_pedido } = req.params;
    try {
      const pedido = await Pedido.obtenerPedidoPorId(id_pedido);
      if (pedido.length === 0) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.json(pedido[0]);
    } catch (error) {
      console.error('Error al obtener pedido por ID:', error);
      res.status(500).json({ message: 'Error al obtener pedido por ID', error });
    }
  }

  // Crear un nuevo pedido
  static async crearPedido(req, res) {
    try {
      const { fecha_pedido, total_pagado, documento, pago_id, id_carrito } = req.body;
      const { foto_Pedido } = req.files || {};

      let foto_PedidoURL = '';
      let uniqueFileName = '';

      if (foto_Pedido) {
        const timestamp = Date.now();
        uniqueFileName = `${foto_Pedido.name.split('.')[0]}_${timestamp}.${foto_Pedido.name.split('.').pop()}`;
        const uploadPath = path.join(__dirname, '../uploads/img/pedido/', uniqueFileName);
        foto_PedidoURL = `http://localhost:4000/uploads/img/pedido/${uniqueFileName}`;

        await foto_Pedido.mv(uploadPath); // Mueve el archivo aquí
      }

      const pedidoData = {
        fecha_pedido,
        total_pagado,
        foto_Pedido: `./uploads/img/pedido/${uniqueFileName}`,
        foto_PedidoURL,
        documento,
        pago_id,
        id_carrito // Asegúrate de que este valor se está pasando correctamente
      };

      console.log('PedidoData:', pedidoData);

      await Pedido.crearPedido(pedidoData);
      res.status(201).json({ message: 'Pedido creado exitosamente' });
    } catch (error) {
      console.error('Error en crearPedido:', error);
      res.status(500).json({ message: 'Error al crear pedido', error });
    }
  }

  // Actualizar un pedido
  static async actualizarPedido(req, res) {
    const { id_pedido } = req.params;
    const { fecha_pedido, total_pagado, documento, pago_id } = req.body;
    const { foto_Pedido } = req.files || {};

    let pedidoActual = await Pedido.findByPk(id_pedido); // Busca el pedido existente

    let foto_PedidoURL = pedidoActual.foto_PedidoURL; // Mantiene la imagen actual por defecto
    let uniqueFileName = '';

    if (foto_Pedido) {
      const timestamp = Date.now();
      uniqueFileName = `${foto_Pedido.name.split('.')[0]}_${timestamp}.${foto_Pedido.name.split('.').pop()}`;
      const uploadPath = path.join(__dirname, '../uploads/img/pedido/', uniqueFileName);
      foto_PedidoURL = `http://localhost:4000/uploads/img/pedido/${uniqueFileName}`;

      try {
        await foto_Pedido.mv(uploadPath); // Mueve el archivo aquí
      } catch (err) {
        console.error('Error al subir el archivo:', err);
        return res.status(500).json({ message: 'Error al subir el archivo', error: err });
      }
    }

    const pedidoData = {
      fecha_pedido,
      total_pagado,
      foto_Pedido: foto_Pedido ? `./uploads/img/pedido/${uniqueFileName}` : pedidoActual.foto_Pedido, // Mantiene la foto existente
      foto_PedidoURL, // Actualiza la URL si se subió una nueva
      documento,
      pago_id
    };

    try {
      const resultado = await Pedido.actualizarPedido(id_pedido, pedidoData);
      res.status(200).json(resultado);
    } catch (error) {
      console.error('Error al actualizar pedido en el modelo:', error);
      res.status(500).json({ message: 'Error al actualizar pedido', error });
    }
  }

  static async cambiarEstadoPedido(req, res) {
    const { id_pedido } = req.params;
    const { nuevo_estado } = req.body;
    const estadosValidos = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];

    if (!estadosValidos.includes(nuevo_estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    try {
      const pedidoExistente = await Pedido.obtenerPedidoPorId(id_pedido);
      if (pedidoExistente.length === 0) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      await Pedido.cambiarEstadoPedido(id_pedido, nuevo_estado);
      res.status(200).json({ message: 'Estado del pedido actualizado correctamente' });
    } catch (error) {
      console.error('Error al cambiar el estado del pedido:', error);
      res.status(500).json({ message: 'Error al cambiar el estado del pedido', error });
    }
  }

  // Obtener historial de pedidos por ID de usuario
  static async obtenerHistorialPedidosPorUsuarioId(req, res) {
    const { documento } = req.params;
    try {
      const historial = await Pedido.obtenerHistorialPedidosPorUsuarioId(documento);
      res.json(historial);
    } catch (error) {
      console.error('Error al obtener historial de pedidos:', error);
      res.status(500).json({ message: 'Error al obtener historial de pedidos', error });
    }
  }

}

export default PedidoController;
