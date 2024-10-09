import path from 'path';
import { fileURLToPath } from 'url';
import Carrito from '../models/Carrito.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CarritoController {
  // Agregar producto al carrito
  static async agregarProducto(req, res) {
    const { documento, id_producto, cantidad } = req.body;
  
    try {
      const result = await Carrito.agregarProducto(documento, id_producto, cantidad);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
    }
  }  
  
  // Actualizar cantidad de producto en el carrito
  static async actualizarCantidad(req, res) {
    const { documento, id_producto } = req.params;
    const { nueva_cantidad } = req.body;

    try {
      if (!nueva_cantidad) {
        return res.status(400).json({ message: 'Falta la nueva cantidad' });
      }

      const result = await Carrito.actualizarCantidad(documento, id_producto, nueva_cantidad);
      res.json(result);
    } catch (error) {
      console.error('Error al actualizar cantidad en el carrito:', error);
      res.status(500).json({ message: 'Error al actualizar cantidad en el carrito', error: error.message });
    }
  }

  // Eliminar producto del carrito
  static async eliminarProducto(req, res) {
    const { documento, id_producto } = req.params;

    try {
      const result = await Carrito.eliminarProducto(documento, id_producto);
      res.json(result);
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
      res.status(500).json({ message: 'Error al eliminar producto del carrito', error: error.message });
    }
  }

  // Ver contenido del carrito
  static async verContenido(req, res) {
    const { documento } = req.params;

    try {
      const contenido = await Carrito.verContenido(documento);
      res.json(contenido);
    } catch (error) {
      console.error('Error al ver contenido del carrito:', error);
      res.status(500).json({ message: 'Error al ver contenido del carrito', error: error.message });
    }
  }

  // Limpiar carrito
  static async limpiarCarrito(req, res) {
    const { documento } = req.params;

    try {
      const result = await Carrito.limpiarCarrito(documento);
      res.json(result);
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      res.status(500).json({ message: 'Error al limpiar carrito', error: error.message });
    }
  }
}

export default CarritoController;
