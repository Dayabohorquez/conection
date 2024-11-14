import Carrito from "../models/Carrito.js";
import CarritoItem from "../models/Carrito_Item.js";

class CarritoController {

  // Obtener carrito de un usuario por documento
  static async obtenerCarritoPorUsuarioId(req, res) {
    const { documento } = req.params;
    try {
      const carrito = await Carrito.obtenerCarritoPorUsuarioId(documento);
      if (!carrito || carrito.length === 0) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
      res.status(200).json(carrito);
    } catch (error) {
      console.error('Error al obtener carrito por usuario ID:', error);
      res.status(500).json({ message: 'Error al obtener carrito', error });
    }
  }

  // Obtener carrito completo por usuario
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

  // Crear un carrito para un usuario
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

    if (!documento || !id_producto || !cantidad) {
      return res.status(400).json({ message: 'Faltan parámetros necesarios (documento, id_producto, cantidad)' });
    }

    try {
      // Verificamos si el stock es suficiente antes de agregar
      await Carrito.verificarStock(id_producto, cantidad);

      // Procedemos a agregar el producto al carrito
      const response = await Carrito.agregarAlCarrito(documento, id_producto, cantidad);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);

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
      res.status(500).json({ message: 'Error al agregar al carrito', error: error.message });
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  static async actualizarCantidad(req, res) {
    const { id_carrito_item } = req.params;
    const { cantidad, id_producto } = req.body;

    // Validar la cantidad y el id_producto
    if (cantidad === undefined || id_producto === undefined) {
      return res.status(400).json({ message: 'La cantidad y el id del producto deben ser proporcionados correctamente.' });
    }

    // Validar la cantidad (debe ser un número entero)
    if (typeof cantidad !== 'number') {
      return res.status(400).json({ message: 'La cantidad debe ser un número válido.' });
    }

    // Verificar que la cantidad no sea 0
    if (cantidad === 0) {
      return res.status(400).json({ message: 'La cantidad de cambio no puede ser 0.' });
    }

    // Verificar que la cantidad no sea menor a un límite permitido si se está restando
    if (cantidad < 0 && Math.abs(cantidad) > 10000) {
      return res.status(400).json({ message: 'No puedes restar más de 10,000 unidades de un producto.' });
    }

    // Calcular la cantidad que cambia (positiva o negativa)
    const cantidad_cambio = cantidad;

    try {
      // Llamar a la función que actualiza la cantidad del carrito
      await Carrito.actualizarCantidadCarrito(id_carrito_item, cantidad_cambio, id_producto);
      res.status(200).json({ message: 'Cantidad actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar cantidad en carrito:', error);
      res.status(500).json({ message: 'Error al actualizar cantidad en carrito', error: error.message });
    }
  }

  // Actualizar las opciones de un item en el carrito (opciones adicionales, dedicatoria)
  static async actualizarItem(req, res) {
    const { opcion_adicional, dedicatoria } = req.body;
    const { itemId } = req.params;

    console.log('Datos recibidos:', { itemId, opcion_adicional, dedicatoria });

    const opcionAdicionalValue = (opcion_adicional === undefined || opcion_adicional === null) ? null : opcion_adicional;

    try {
      const resultado = await Carrito.actualizarCarritoItem(itemId, opcionAdicionalValue, dedicatoria);
      return res.status(200).json(resultado);
    } catch (error) {
      console.error('Error al actualizar item del carrito:', error);
      return res.status(500).json({ message: 'Error al actualizar el item', error: error.message });
    }
  }

  // Actualizar el total del carrito
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

    if (!documento) {
      return res.status(400).json({ message: 'Documento no proporcionado' });
    }

    try {
      await Carrito.vaciarCarrito(documento);
      res.status(200).json({ message: 'Carrito vaciado exitosamente' });
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      res.status(500).json({ message: 'Error al vaciar carrito', error });
    }
  }

  // Verificar disponibilidad de un producto
  static async verificarDisponibilidad(req, res) {
    const { id_producto, cantidad } = req.params;

    if (!id_producto || !cantidad || cantidad <= 0) {
      return res.status(400).json({ message: 'Parámetros inválidos (id_producto y cantidad son obligatorios y la cantidad debe ser mayor a 0)' });
    }

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
