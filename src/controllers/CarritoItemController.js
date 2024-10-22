import CarritoItem from '../models/Carrito_Item.js';
import Carrito from '../models/Carrito.js';
import Usuario from '../models/Usuario.js';

class CarritoItemController {
  // Obtener todos los items del carrito
  static async obtenerItemsPorCarritoId(req, res) {
    const { id_carrito } = req.params;
    try {
      const items = await CarritoItem.getItemsByCarritoId(id_carrito);
      res.status(200).json(items);
    } catch (error) {
      console.error('Error al obtener items del carrito:', error);
      res.status(500).json({ message: 'Error al obtener items del carrito', error });
    }
  }

  static async obtenerItemsDelCarrito(req, res) {
    const documento = req.params.documento;

    try {
      const carrito = await Carrito.findOne({ where: { documento } });
      if (!carrito) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      const items = await CarritoItem.findAll({ where: { id_carrito: carrito.id_carrito } });
      res.status(200).json(items);
    } catch (error) {
      console.error('Error al obtener los items del carrito:', error);
      res.status(500).json({ message: 'Error al obtener los items del carrito', error });
    }
  }

  // Agregar un item al carrito
  static async agregarAlCarrito(req, res) {
    const { id_producto, cantidad, dedicatoria, opcion_adicional, precio_adicional } = req.body;
    const documento = parseInt(req.user?.documento, 10);

    if (isNaN(documento)) {
      return res.status(400).json({ message: 'Documento no proporcionado o inválido' });
    }

    try {
      // Verificar si el usuario existe
      const usuario = await Usuario.findOne({ where: { documento } });
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verificar o crear el carrito
      let carrito = await Carrito.findOne({ where: { documento } }); // Cambiar const a let
      if (!carrito) {
        carrito = await Carrito.create({ documento });
      }

      // Agregar el ítem al carrito
      await CarritoItem.addItemToCarrito(
        documento,
        id_producto,
        cantidad,
        dedicatoria,
        opcion_adicional,
        precio_adicional
      );

      // Obtener los ítems actuales del carrito
      const items = await CarritoItem.findAll({ where: { id_carrito: carrito.id_carrito } });
      res.status(201).json({ message: 'Producto agregado al carrito exitosamente', items });
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
    }
  }

  // Actualizar la cantidad de un item en el carrito
  static async actualizarCantidad(req, res) {
    const { id_carrito_item } = req.params;
    const { cantidad } = req.body;

    try {
      const result = await CarritoItem.updateItemQuantity(id_carrito_item, cantidad);
      res.json(result);
    } catch (error) {
      console.error('Error al actualizar cantidad del item:', error);
      res.status(500).json({ message: 'Error al actualizar cantidad del item', error });
    }
  }

  // Eliminar un item del carrito
  static async eliminarItemDelCarrito(req, res) {
    const { id_carrito_item } = req.params;

    try {
      const result = await CarritoItem.deleteItemFromCarrito(id_carrito_item);
      res.json(result);
    } catch (error) {
      console.error('Error al eliminar item del carrito:', error);
      res.status(500).json({ message: 'Error al eliminar item del carrito', error });
    }
  }
}

export default CarritoItemController;
