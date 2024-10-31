import CarritoItem from '../models/Carrito_Item.js';
import Carrito from '../models/Carrito.js';

class CarritoItemController {
  // Obtener todos los items del carrito por ID de carrito
  static async obtenerItemsPorCarritoId(req, res) {
    const { id_carrito } = req.params;
    try {
      const items = await CarritoItem.getItemsByCarritoId(id_carrito);
      res.status(200).json(items);
    } catch (error) {
      console.error('Error al obtener items del carrito:', error.message);
      res.status(500).json({ message: 'Error al obtener items del carrito', error: error.message });
    }
  }

  // Obtener items del carrito por documento de usuario
  static async obtenerItemsDelCarrito(req, res) {
    const documento = req.params.documento;

    try {
      const carrito = await Carrito.findOne({ where: { documento } });
      if (!carrito) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      const items = await CarritoItem.getItemsByCarritoId(carrito.id_carrito);
      res.status(200).json(items);
    } catch (error) {
      console.error('Error al obtener los items del carrito:', error.message);
      res.status(500).json({ message: 'Error al obtener los items del carrito', error: error.message });
    }
  }

  static async agregarItemAlCarrito(req, res) {
    console.log(req.body); // Para verificar lo que se recibe
    const { documento, id_producto, cantidad, dedicatoria, id_opcion } = req.body;

    try {
        await CarritoItem.agregarAlCarrito(documento, id_producto, cantidad, dedicatoria, id_opcion);
        res.status(200).json({ message: 'Producto añadido al carrito' });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ message: 'Error al agregar al carrito', error });
    }
}

  // Actualizar la cantidad de un item en el carrito
  static async actualizarCantidad(req, res) {
    const { id_carrito_item } = req.params;
    const { cantidad } = req.body;

    try {
      const result = await CarritoItem.updateItemQuantity(id_carrito_item, cantidad);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al actualizar cantidad del item:', error.message);
      res.status(500).json({ message: 'Error al actualizar cantidad del item', error: error.message });
    }
  }

  // Eliminar un item del carrito
  static async eliminarItemDelCarrito(req, res) {
    const { id_carrito_item } = req.params;

    try {
      const result = await CarritoItem.deleteItemFromCarrito(id_carrito_item);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al eliminar item del carrito:', error.message);
      res.status(500).json({ message: 'Error al eliminar item del carrito', error: error.message });
    }
  }
}

export default CarritoItemController;
