// src/controllers/pedido.controller.js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Pedido from "../models/Pedido.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PedidoController {
  // Obtener todos los pedidos
  static async obtenerPedidos(req, res) {
    try {
      const pedidos = await Pedido.obtenerPedidos();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pedidos', error });
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
      res.status(500).json({ message: 'Error al obtener pedido por ID', error });
    }
  }

  // Crear un nuevo pedido
  static async crearPedido(req, res) {
    try {
      const { archivo } = req.files || {}; // archivo es un ejemplo de cómo podrías recibir el archivo

      if (archivo) {
        const timestamp = Date.now();
        const uniqueFileName = `${archivo.name.split('.')[0]}_${timestamp}.${archivo.name.split('.').pop()}`;
        const uploadPath = path.join(__dirname, '../uploads/pedidos/', uniqueFileName);
        const archivoURL = `http://localhost:4000/uploads/pedidos/${uniqueFileName}`;

        archivo.mv(uploadPath, async (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error al subir el archivo', error: err });
          }

          // Incluye el URL del archivo en el objeto de datos del pedido
          const pedidoData = { ...req.body, archivo: `./uploads/pedidos/${uniqueFileName}`, archivoURL };

          try {
            const message = await Pedido.crearPedido(pedidoData);
            res.status(201).json({ message });
          } catch (error) {
            res.status(500).json({ message: 'Error al crear pedido', error });
          }
        });
      } else {
        const pedidoData = req.body;
        try {
          const message = await Pedido.crearPedido(pedidoData);
          res.status(201).json({ message });
        } catch (error) {
          res.status(500).json({ message: 'Error al crear pedido', error });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al crear pedido', error });
    }
  }

  // Actualizar un pedido existente
  static async actualizarPedido(req, res) {
    const { id_pedido } = req.params;
    const updatedData = req.body;

    try {
      const pedidoExistente = await Pedido.obtenerPedidoPorId(id_pedido);
      if (pedidoExistente.length === 0) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      if (req.files && req.files.archivo) {
        const uploadedFile = req.files.archivo;
        const timestamp = Date.now();
        const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
        const uploadPath = path.join(__dirname, '../uploads/pedidos/', uniqueFileName);
        const archivoURL = `http://localhost:4000/uploads/pedidos/${uniqueFileName}`;

        uploadedFile.mv(uploadPath, async (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error al mover el archivo', error: err });
          }

          if (pedidoExistente[0].archivo) {
            const oldImagePath = path.join(__dirname, '..', pedidoExistente[0].archivo);
            if (fs.existsSync(oldImagePath)) {
              try {
                fs.unlinkSync(oldImagePath);
                console.log('Archivo anterior eliminado:', oldImagePath);
              } catch (unlinkError) {
                console.error('Error al eliminar el archivo anterior:', unlinkError);
              }
            }
          }

          const updatedPedido = { ...updatedData, archivo: `./uploads/pedidos/${uniqueFileName}`, archivoURL };
          try {
            const message = await Pedido.actualizarPedido(id_pedido, updatedPedido);
            res.status(200).json({ message });
          } catch (error) {
            res.status(500).json({ message: 'Error al actualizar pedido', error });
          }
        });
      } else {
        // Actualizar el pedido sin cambiar el archivo
        try {
          const message = await Pedido.actualizarPedido(id_pedido, updatedData);
          res.status(200).json({ message });
        } catch (error) {
          res.status(500).json({ message: 'Error al actualizar pedido', error });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar pedido', error });
    }
  }

  // Eliminar un pedido
  static async eliminarPedido(req, res) {
    const { id_pedido } = req.params;
    try {
      const pedidoExistente = await Pedido.obtenerPedidoPorId(id_pedido);
      if (pedidoExistente.length === 0) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      if (pedidoExistente[0].archivo) {
        const oldImagePath = path.join(__dirname, '..', pedidoExistente[0].archivo);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log('Archivo eliminado:', oldImagePath);
          } catch (unlinkError) {
            console.error('Error al eliminar el archivo:', unlinkError);
          }
        }
      }

      const message = await Pedido.eliminarPedido(id_pedido);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar pedido', error });
    }
  }

  // Obtener historial de compras por ID de usuario
  static async obtenerHistorialComprasPorUsuarioId(req, res) {
    const { documento } = req.params;
    try {
      const historial = await Pedido.obtenerHistorialComprasPorUsuarioId(documento);
      res.json(historial);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener historial de compras', error });
    }
  }
}

export default PedidoController;
