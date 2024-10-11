import Pago from "../models/Pago.js";
import Pedido from "../models/Pedido.js";
import Carrito from "../models/Carrito.js";

class PagoController {
  // Crear un nuevo pago y un pedido asociado
  static async createPago(req, res) {
    const {
      nombre_pago,
      fecha_pago,
      iva,
      metodo_pago,
      subtotal_pago,
      total_pago,
      documento,
      id_carrito
    } = req.body;

    // Validación de campos obligatorios
    if (!nombre_pago || !fecha_pago || !iva || !metodo_pago || !subtotal_pago || !total_pago || !documento || !id_carrito) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const pagoData = {
      nombre_pago,
      fecha_pago: new Date(fecha_pago), // Asegúrate de que esto sea un objeto Date
      iva,
      metodo_pago,
      subtotal_pago,
      total_pago
    };

    try {
      // Verificar si el carrito existe
      const carrito = await Carrito.getCarritoByUsuarioId(documento); // Asegúrate de que esta función exista
      if (!carrito) {
        return res.status(404).json({ message: 'Carrito no encontrado.' });
      }

      // Crear el pago
      const nuevoPagoId = await Pago.crearPago(pagoData.nombre_pago, pagoData.fecha_pago, pagoData.iva, pagoData.metodo_pago, pagoData.subtotal_pago, pagoData.total_pago);
      console.log('Nuevo Pago ID:', nuevoPagoId); // Esto debe mostrar el id_pago

      // Crear el pedido asociado
      const pedidoData = {
        fecha_pedido: new Date(),
        total_pagado: total_pago,
        documento,
        pago_id: nuevoPagoId,
        id_carrito
      };

      const nuevoPedido = await Pedido.crearPedido(pedidoData);

      // Vaciar el carrito
      await Carrito.vaciarCarrito(id_carrito);

      res.status(201).json({ message: 'Pago, pedido creados y carrito vaciado exitosamente', pedido: nuevoPedido });
    } catch (error) {
      console.error('Error al crear pago y pedido:', error);
      res.status(500).json({ message: 'Error al crear pago y pedido', error: error.message });
    }
  }

  // Obtener todos los pagos
  static async getPagos(req, res) {
    try {
      const pagos = await Pago.getPagos();
      res.json(pagos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pagos', error: error.message });
    }
  }

  // Obtener un pago por ID
  static async getPagoById(req, res) {
    const { id } = req.params;
    try {
      const pago = await Pago.getPagoById(id);
      if (!pago.length) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }
      res.json(pago);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pago por ID', error: error.message });
    }
  }

  // Actualizar un pago existente
  static async updatePago(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    // Validación de entrada
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: 'Los datos a actualizar son obligatorios.' });
    }

    try {
      const message = await Pago.updatePago(id, updatedData);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar pago', error: error.message });
    }
  }

  // Controlador para actualizar el estado de un pago
  static async actualizarEstadoPago(req, res) {
    const { id } = req.params;
    const { estado_pago } = req.body;

    // Validación de entrada
    if (!estado_pago) {
      return res.status(400).json({ message: 'El estado del pago es obligatorio.' });
    }

    try {
      const resultado = await Pago.updateEstadoPago(id, estado_pago);
      res.json(resultado);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el estado del pago', error: error.message });
    }
  }

  // Eliminar un pago
  static async deletePago(req, res) {
    const { id } = req.params;
    try {
      const message = await Pago.deletePago(id);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar pago', error: error.message });
    }
  }
}

export default PagoController;
