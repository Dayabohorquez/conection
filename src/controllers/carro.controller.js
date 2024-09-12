import Carrito from '../models/Carrito.js';

class CarritoController {
  static async getAllCarritos(req, res) {
    try {
      const carritos = await Carrito.findAll();
      if (carritos.length > 0) {
        res.json(carritos);
      } else {
        res.status(404).json({ message: 'No hay carritos disponibles' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener todos los carritos', error });
    }
  }

  // Obtener el carrito de un usuario
static async getCarritoByUsuarioId(req, res) {
  const { documento } = req.params;
  console.log('Recibiendo documento:', documento);
  
  try {
    const carrito = await Carrito.getCarritoByUsuarioId(documento);
    console.log('Resultado de la consulta:', carrito);
    
    // Verifica si los datos están envueltos en un array
    if (carrito[0] && carrito[0].length > 0) {
      res.json(carrito[0]); // Envía el primer nivel del array si hay datos
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener carrito por ID de usuario:', error);
    res.status(500).json({ message: 'Error al obtener carrito por ID de usuario', error });
  }
}


  // Agregar un producto al carrito
  static async addToCarrito(req, res) {
    const { documento, id_producto, cantidad } = req.body;
    try {
      const message = await Carrito.addToCarrito(documento, id_producto, cantidad);
      res.status(201).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
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
      res.status(500).json({ message: 'Error al eliminar producto del carrito', error });
    }
  }

  // Vaciar el carrito de un usuario
  static async emptyCarrito(req, res) {
    const { documento } = req.params;
    try {
      const message = await Carrito.emptyCarrito(documento);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al vaciar carrito', error });
    }
  }

  // Verificar la disponibilidad de un producto en el carrito
  static async checkAvailabilityInCarrito(req, res) {
    const { id_producto } = req.params;
    const { cantidad } = req.query; // Usando `req.query` para parámetros de consulta
    try {
      const disponibilidad = await Carrito.checkAvailabilityInCarrito(id_producto, cantidad);
      res.json(disponibilidad);
    } catch (error) {
      res.status(500).json({ message: 'Error al verificar disponibilidad en carrito', error });
    }
  }
}

export default CarritoController;