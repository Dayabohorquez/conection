import Pago from '../models/Pago.js';
import { sendNotification } from '../services/notificaciones.js';

class PagoController {
  // Crear un nuevo pago
  static async crearPago(req, res) {
    try {
      const nuevoPago = await Pago.crearPago(req.body);
      return res.status(201).json({ id_pago: nuevoPago, message: 'Pago creado exitosamente.' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Obtener todos los pagos
  static async obtenerPagos(req, res) {
    try {
      const pagos = await Pago.obtenerPagos();
      return res.status(200).json(pagos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Obtener un pago por ID
  static async obtenerPagoPorId(req, res) {
    const { id } = req.params;
    try {
      const pago = await Pago.obtenerPagoPorId(id);
      if (!pago) {
        return res.status(404).json({ message: 'Pago no encontrado.' });
      }
      return res.status(200).json(pago);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Actualizar un pago
  static async actualizarPago(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      await Pago.actualizarPago(id, updatedData);
      return res.status(200).json({ message: 'Pago actualizado exitosamente.' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Actualizar el estado de un pago
  static async actualizarEstadoPago(req, res) {
    const { estado_pago } = req.body;
    const { id } = req.params; // Asegúrate de que esto coincide con la ruta

    try {
      const result = await Pago.actualizarEstadoPago(id, estado_pago);
      
      // Verificar si el estado es "Fallido"
      if (estado_pago === 'Fallido') {
        const pago = await Pago.obtenerPagoPorId(id);
        await sendNotification(pago); // Enviar notificación al administrador
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error al actualizar el estado del pago:', error);
      res.status(500).json({ message: 'Error al actualizar el estado del pago', error: error.message });
    }
  }

  // Eliminar un pago
  static async eliminarPago(req, res) {
    const { id } = req.params;

    try {
      await Pago.eliminarPago(id);
      return res.status(200).json({ message: 'Pago eliminado exitosamente.' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default PagoController;
