import Carrito from '../models/Carrito.js';
import Producto from '../models/Producto.js';

class CarritoController {
  static async getAllCarritos(req, res) {
    try {
      const carritos = await Carrito.getAllCarritos();
      if (carritos.length > 0) {
        req.json(carritos);
      } else {
        res.status(404).json({ message: 'No hay carritos disponibles' });
      }
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error);
      res.status(500).json({ message: 'Error al obtener todos los carritos', error });
    }
  }  

  static async getCarritoByUsuarioId(req, res) {
    const { documento } = req.params;
    console.log('Recibiendo documento:', documento);
    
    try {
      const carrito = await Carrito.getCarritoByUsuarioId(documento);
      console.log('Resultado de la consulta:', carrito);
      
      if (carrito[0] && carrito[0].length > 0) {
        res.json(carrito[0]);
      } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener carrito por ID de usuario:', error);
      res.status(500).json({ message: 'Error al obtener carrito por ID de usuario', error });
    }
  }

  static async addToCarrito(req, res) {
    const { documento, id_producto, cantidad } = req.body;
    try {
      await Carrito.addToCarrito(documento, id_producto, cantidad);
  
      const producto = await Producto.findByPk(id_producto);
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      const subtotal = producto.precio_producto * cantidad;
      await Carrito.updateTotal(documento, subtotal);
  
      res.status(201).json({ message: 'Producto agregado al carrito y total actualizado' });
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      res.status(500).json({ message: 'Error al agregar producto al carrito', error });
    }
  }  

  static async updateQuantityInCarrito(req, res) {
    const { id_carrito } = req.params;
    const { cantidad } = req.body;
    try {
      const message = await Carrito.updateQuantityInCarrito(id_carrito, cantidad);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar cantidad en carrito', error });
    }
  }

  static async deleteFromCarrito(req, res) {
    const { id_carrito } = req.params;
    try {
      const message = await Carrito.deleteFromCarrito(id_carrito);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar producto del carrito', error });
    }
  }

  static async emptyCarrito(req, res) {
    const { documento } = req.params;
    try {
      const message = await Carrito.emptyCarrito(documento);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al vaciar carrito', error });
    }
  }

  static async checkAvailabilityInCarrito(req, res) {
    const { id_producto } = req.params;
    const { cantidad } = req.body;
    try {
      const result = await Carrito.checkAvailabilityInCarrito(id_producto, cantidad);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error al verificar disponibilidad del producto', error });
    }
  }
}

export default CarritoController;