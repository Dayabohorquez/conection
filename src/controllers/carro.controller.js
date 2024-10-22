import Carrito from "../models/Carrito.js";

class CarritoController {
  // Obtener carrito de un usuario por documento
  static async obtenerCarritoPorUsuarioId(req, res) {
    const { documento } = req.params;
    try {
      const carrito = await Carrito.obtenerCarritoPorUsuarioId(documento);
      res.status(200).json(carrito);
    } catch (error) {
      console.error('Error al obtener carrito por usuario ID:', error);
      res.status(500).json({ message: 'Error al obtener carrito', error });
    }
  }

  static async obtenerCarritoCompletoPorUsuarioId(req, res) {
    const { documento } = req.params;
    try {
      const carrito = await Carrito.obtenerCarritoCompletoPorUsuarioId(documento);
      if (!carrito || carrito.length === 0) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
      res.status(200).json(carrito);
    } catch (error) {
      console.error('Error al obtener carrito completo por usuario ID:', error);
      res.status(500).json({ message: 'Error al obtener carrito', error: error.message });
    }
  }

  // Crear carrito
  static async crearCarrito(req, res) {
    const documento = req.user?.documento; // Suponiendo que obtienes el documento del usuario autenticado

    if (!documento) {
      return res.status(400).json({ message: 'Documento no proporcionado' });
    }

    try {
      const carrito = await Carrito.crearCarrito(documento);
      res.status(201).json(carrito);
    } catch (error) {
      console.error('Error al crear carrito:', error);
      res.status(500).json({ message: 'Error al crear carrito', error: error.message });
    }
  }

  // Agregar un producto al carrito
  static async agregarAlCarrito(req, res) {
    const { documento, id_producto, cantidad } = req.body;

    try {
      await Carrito.agregarAlCarrito(documento, id_producto, cantidad);
      res.status(200).json({ message: 'Producto añadido al carrito' });
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      res.status(500).json({ message: 'Error al agregar al carrito', error });
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  static async actualizarCantidad(req, res) {
    const { id_carrito_item } = req.params;
    const { cantidad } = req.body;

    try {
      await Carrito.actualizarCantidadCarrito(id_carrito_item, cantidad);
      res.status(200).json({ message: 'Cantidad actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar cantidad en carrito:', error);
      res.status(500).json({ message: 'Error al actualizar cantidad en carrito', error });
    }
  }

  static async actualizarCarritoItem(req, res) {
    const { itemId } = req.params;
    const { opcion_adicional, dedicatoria } = req.body;

    try {
      await Carrito.actualizarCarritoItem(itemId, opcion_adicional, dedicatoria);
      res.status(200).json({ message: 'Carrito item actualizado correctamente.' });
    } catch (error) {
      console.error('Error al actualizar el carrito item:', error);
      res.status(500).json({ message: 'Error al actualizar el carrito item.', error: error.message });
    }
  }

  static async actualizarTotalCarrito(req, res) {
    const { id_carrito } = req.params;

    try {
      await Carrito.actualizarTotal(id_carrito);
      return res.status(200).json({ message: 'Total del carrito actualizado exitosamente.' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al actualizar el total del carrito.', error });
    }
  }

  // Eliminar un producto del carrito
  static async eliminarDelCarrito(req, res) {
    const { id_carrito_item } = req.params;

    try {
      await Carrito.eliminarDelCarrito(id_carrito_item);
      res.status(200).json({ message: 'Producto eliminado del carrito exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      res.status(500).json({ message: 'Error al eliminar del carrito', error });
    }
  }

  // Vaciar el carrito de un usuario
  static async vaciarCarrito(req, res) {
    const { documento } = req.params;

    try {
      await Carrito.vaciarCarrito(documento);
      res.status(200).json({ message: 'Carrito vaciado exitosamente' });
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      res.status(500).json({ message: 'Error al vaciar carrito', error });
    }
  }

  // Verificar disponibilidad de un producto en el carrito
  static async verificarDisponibilidad(req, res) {
    const { id_producto, cantidad } = req.params;

    try {
      const disponibilidad = await Carrito.verificarDisponibilidadProducto(id_producto, cantidad);
      res.status(200).json(disponibilidad);
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      res.status(500).json({ message: 'Error al verificar disponibilidad', error });
    }
  }
}

export default CarritoController;
