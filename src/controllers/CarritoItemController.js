import CarritoItem from '../models/Carrito_Item.js';
import Carrito from '../models/Carrito.js';
import Producto from '../models/Producto.js';

class CarritoItemController {

  // Obtener todos los items del carrito por ID de carrito
  static async obtenerItemsPorCarritoId(req, res) {
    const { id_carrito } = req.params;
    try {
      const items = await CarritoItem.getItemsByCarritoId(id_carrito);
      if (!items || items.length === 0) {
        return res.status(404).json({ message: 'No hay items en el carrito.' });
      }
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
      // Obtener el carrito del usuario
      const carrito = await Carrito.findOne({ where: { documento } });
      if (!carrito) {
        return res.status(404).json({ message: 'Carrito no encontrado para este usuario.' });
      }

      // Obtener los items del carrito
      const items = await CarritoItem.getItemsByCarritoId(carrito.id_carrito);
      if (!items || items.length === 0) {
        return res.status(404).json({ message: 'El carrito está vacío.' });
      }

      res.status(200).json(items);
    } catch (error) {
      console.error('Error al obtener los items del carrito:', error.message);
      res.status(500).json({ message: 'Error al obtener los items del carrito', error: error.message });
    }
  }

  // Agregar un item al carrito
  static async agregarItemAlCarrito(req, res) {
    const { documento, id_producto, cantidad, dedicatoria, id_opcion } = req.body;

    try {
      // Verificamos que los parámetros estén presentes
      if (!documento || !id_producto || !cantidad) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos: documento, id_producto o cantidad.' });
      }

      // Verificar si el producto existe y tiene stock disponible
      const producto = await Producto.findOne({ where: { id_producto } });
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
      }

      // Verificar stock disponible
      const stockDisponible = producto.cantidad_disponible; // Usamos cantidad_disponible para validación
      if (stockDisponible < cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para este producto. Solo hay ${stockDisponible} unidades disponibles.` });
      }

      // Llamar al método del modelo para agregar el item al carrito
      const response = await CarritoItem.agregarAlCarrito(documento, id_producto, cantidad, dedicatoria, id_opcion);
      return res.status(200).json(response);  // Retornar el mensaje de éxito

    } catch (error) {
      console.error('Error al agregar item al carrito:', error.message);

      // Manejo de errores específicos
      if (error.message.includes('producto agotado')) {
        return res.status(400).json({ message: 'El producto está agotado y no se puede agregar al carrito.' });
      }
      if (error.message.includes('stock insuficiente')) {
        return res.status(400).json({ message: 'La cantidad solicitada excede el stock disponible.' });
      }
      if (error.message.includes('producto inactivo')) {
        return res.status(400).json({ message: 'El producto está inactivo y no se puede agregar al carrito.' });
      }

      // Respuesta genérica si no se puede identificar el error
      res.status(500).json({ message: 'Error al agregar el producto al carrito', error: error.message });
    }
  }

  // Método para actualizar la cantidad de un producto en el carrito
  static async actualizarCantidad(id_carrito_item, cantidad) {
    const transaction = await sequelize.transaction();

    try {
      // Verificar si el item existe en el carrito
      const carritoItem = await CarritoItem.findOne({ where: { id_carrito_item } });
      if (!carritoItem) {
        throw new Error('El item no existe en el carrito.');
      }

      // Verificar si la nueva cantidad es válida
      const producto = await Producto.findOne({ where: { id_producto: carritoItem.id_producto } });
      if (!producto) {
        throw new Error('Producto no encontrado.');
      }

      const stockDisponible = producto.cantidad_disponible;
      if (stockDisponible < cantidad) {
        throw new Error('Stock insuficiente para esta cantidad.');
      }

      // Actualizar la cantidad en el carrito
      carritoItem.cantidad = cantidad;
      await carritoItem.save({ transaction });

      // Confirmar la transacción
      await transaction.commit();
      return { message: 'Cantidad del producto actualizada exitosamente.' };

    } catch (error) {
      console.error('Error al actualizar cantidad del carrito:', error);
      await transaction.rollback();
      throw error;  // Lanzamos el error para que el controlador lo maneje
    }
  }

  // Eliminar un item del carrito
  static async eliminarItemDelCarrito(req, res) {
    const { id_carrito_item } = req.params;

    // Verificar si el id_carrito_item está presente en los parámetros de la solicitud
    if (!id_carrito_item) {
      return res.status(400).json({ message: 'El id del item del carrito es obligatorio.' });
    }

    try {
      // Llamar al modelo para eliminar el item del carrito
      const result = await CarritoItem.deleteItemFromCarrito(id_carrito_item);

      // Si el item se elimina correctamente, devolver el mensaje de éxito
      return res.status(200).json(result);

    } catch (error) {
      // Capturar cualquier error y devolver una respuesta adecuada
      console.error('Error al eliminar item del carrito:', error.message);

      // Si el error es por la falta de existencia del item, puede ser 404
      if (error.message === 'El item no existe en el carrito.') {
        return res.status(404).json({ message: error.message });
      }

      // Si es un error genérico, devolver un 500
      return res.status(500).json({
        message: 'Error al eliminar item del carrito',
        error: error.message
      });
    }
  }
}

export default CarritoItemController;
