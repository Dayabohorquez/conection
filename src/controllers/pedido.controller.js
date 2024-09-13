// src/controllers/pedido.controller.js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Pedido from "../models/Pedido.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PedidoController {
  static async obtenerPedidos(req, res) {
    try {
      const pedidos = await Pedido.obtenerPedidos();
      res.json(pedidos);
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
      res.status(500).json({ message: 'Error al obtener pedido por ID', error: error.message });
    }
  }

  static async crearPedido(req, res) {
    try {
      const { fecha_pedido, estado_pedido, total_pagado, documento, pago_id, id_carrito } = req.body;
      const { foto_Pedido } = req.files || {};
      
      let foto_PedidoURL = '';
      let uniqueFileName = '';
      
      if (foto_Pedido) {
        const timestamp = Date.now();
        uniqueFileName = `${foto_Pedido.name.split('.')[0]}_${timestamp}.${foto_Pedido.name.split('.').pop()}`;
        const uploadPath = path.join(__dirname, '../uploads/img/pedidos/', uniqueFileName);
        foto_PedidoURL = `http://localhost:4000/uploads/img/pedidos/${uniqueFileName}`;
  
        foto_Pedido.mv(uploadPath, (err) => {
          if (err) {
            console.error('Error al subir el archivo:', err);
            return res.status(500).json({ message: 'Error al subir el archivo', error: err.message });
          }
        });
      }
    
      const pedidoData = {
        fecha_pedido,
        estado_pedido,
        total_pagado,
        foto_Pedido: `./uploads/img/pedidos/${uniqueFileName}`,
        foto_PedidoURL,
        documento,
        pago_id,
        id_carrito
      };
    
      console.log('PedidoData:', pedidoData);
    
      try {
        await Pedido.crearPedido(pedidoData);
        res.status(201).json({ message: 'Pedido creado exitosamente' });
      } catch (error) {
        console.error('Error al crear pedido en el modelo:', error);
        res.status(500).json({ message: 'Error al crear pedido', error: error.message });
      }
    } catch (error) {
      console.error('Error en crearPedido:', error);
      res.status(500).json({ message: 'Error al crear pedido', error: error.message });
    }
  }
  
  static async actualizarPedido(req, res) {
    const { id_pedido } = req.params;
    const updatedData = req.body;

    try {
      const pedidoExistente = await Pedido.obtenerPedidoPorId(id_pedido);
      if (pedidoExistente.length === 0) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      if (req.files && req.files.foto_Pedido) {
        const uploadedFile = req.files.foto_Pedido;
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}_${uploadedFile.name}`;
        const uploadPath = path.join(__dirname, '../uploads/img/pedidos/', uniqueFileName);
        const foto_PedidoURL = `http://localhost:4000/uploads/img/pedidos/${uniqueFileName}`;

        uploadedFile.mv(uploadPath, async (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error al mover el archivo', error: err.message });
          }

          // Eliminar archivo anterior si existe
          if (pedidoExistente[0].foto_Pedido) {
            const oldImagePath = path.join(__dirname, '..', pedidoExistente[0].foto_Pedido.replace('http://localhost:4000/', ''));
            if (fs.existsSync(oldImagePath)) {
              try {
                fs.unlinkSync(oldImagePath);
                console.log('Archivo anterior eliminado:', oldImagePath);
              } catch (unlinkError) {
                console.error('Error al eliminar el archivo anterior:', unlinkError);
              }
            }
          }

          const updatedPedido = {
            ...updatedData,
            foto_Pedido: `./uploads/img/pedidos/${uniqueFileName}`,
            foto_PedidoURL
          };

          try {
            await Pedido.actualizarPedido(id_pedido, updatedPedido);
            res.status(200).json({ message: 'Pedido actualizado correctamente' });
          } catch (error) {
            res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
          }
        });
      } else {
        // Actualizar el pedido sin cambiar el archivo
        try {
          await Pedido.actualizarPedido(id_pedido, updatedData);
          res.status(200).json({ message: 'Pedido actualizado correctamente' });
        } catch (error) {
          res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
    }
  }

  // Cambiar estado de un pedido
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
      res.status(500).json({ message: 'Error al cambiar el estado del pedido', error: error.message });
    }
  }

  // Obtener historial de compras por ID de usuario
  static async obtenerHistorialComprasPorUsuarioId(req, res) {
    const { documento } = req.params;
    try {
      const historial = await Pedido.obtenerHistorialComprasPorUsuarioId(documento);
      res.json(historial);
    } catch (error) {
      console.error('Error al obtener historial de compras:', error);
      res.status(500).json({ message: 'Error al obtener historial de compras', error: error.message });
    }
  }
}

export default PedidoController;
