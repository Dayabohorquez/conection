import Carrito from '../models/Carrito.js';
import Producto from '../models/Producto.js';

class CarritoController {
  // Obtener todos los carritos
  static async getAllCarritos(req, res) {
    try {
      const carritos = await Carrito.getAllCarritos();
      if (carritos.length > 0) {
        res.json(carritos);
      } else {
        res.status(404).json({ message: 'No hay carritos disponibles' });
      }
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error);
      res.status(500).json({ message: 'Error al obtener todos los carritos', error });
    }
  }

  // Obtener el carrito de un usuario específico por documento
  static async getCarritoByUsuarioId(req, res) {
    const { documento } = req.params;
    try {
      const carrito = await Carrito.getCarritoByUsuarioId(documento);
      if (carrito.length === 0) {
        return res.status(404).json({ message: 'No se encontraron productos en el carrito.' });
      }
      res.json(carrito);
    } catch (error) {
      console.error('Error al obtener carrito por ID de usuario:', error);
      res.status(500).json({ message: 'Error al obtener carrito por ID de usuario', error });
    }
  }

  // Agregar un producto al carrito
  static async addToCarrito(req, res) {
    const { documento, id_producto, cantidad } = req.body;
    console.log({ documento, id_producto, cantidad });

    const documentoInt = parseInt(documento, 10);
    const idProductoInt = parseInt(id_producto, 10);
    const cantidadInt = parseInt(cantidad, 10);

    if (isNaN(documentoInt) || isNaN(idProductoInt) || isNaN(cantidadInt)) {
      return res.status(400).json({ message: 'Los valores deben ser numéricos.' });
    }

    try {
      const producto = await Producto.findByPk(idProductoInt);
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      // Verificar la disponibilidad
      const availabilityCheck = await Carrito.checkAvailabilityInCarrito(idProductoInt, cantidadInt);
      if (!availabilityCheck || availabilityCheck.length === 0) {
        return res.status(400).json({ message: 'Cantidad no disponible.' });
      }

      // Agregar al carrito
      await Carrito.addToCarrito(documentoInt, idProductoInt, cantidadInt);
      const subtotal = producto.precio_producto * cantidadInt;
      res.status(201).json({ message: 'Producto agregado al carrito exitosamente', subtotal });
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      res.status(500).json({ message: 'Error al agregar producto al carrito', error });
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  static async updateQuantityInCarrito(req, res) {
    const { id_carrito } = req.params;
    const { cantidad } = req.body;

    try {
      const message = await Carrito.updateQuantityInCarrito(id_carrito, cantidad);
      res.json({ message });
    } catch (error) {
      console.error('Error al actualizar cantidad en carrito:', error);
      res.status(500).json({ message: 'Error al actualizar cantidad en carrito', error });
    }
  }

  // Eliminar un producto del carrito
  static async deleteFromCarrito(req, res) {
    const { id_carrito } = req.params;

    try {
      const message = await Carrito.deleteFromCarrito(id_carrito);
      res.json({ message });
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
      res.status(500).json({ message: 'Error al eliminar producto del carrito', error });
    }
  }

  // Vaciar el carrito de un usuario
  static async vaciarCarrito(req, res) {
    const { documento } = req.params;
    const { id_carrito } = req.body; // Asegúrate de que id_carrito venga en el cuerpo de la solicitud

    try {
      // Llama al método para vaciar el carrito
      const message = await Carrito.vaciarCarrito(id_carrito);
      res.json({ message });
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      res.status(500).json({ message: 'Error al vaciar carrito', error: error.message });
    }
  }

  // Verificar la disponibilidad de un producto
  static async checkAvailabilityInCarrito(req, res) {
    const { id_producto } = req.params;
    const { cantidad } = req.body;

    try {
      const available = await Carrito.checkAvailabilityInCarrito(id_producto, cantidad);
      res.json({ available });
    } catch (error) {
      console.error('Error al verificar disponibilidad del producto:', error);
      res.status(500).json({ message: 'Error al verificar disponibilidad del producto', error });
    }
  }
}

export default CarritoController;
