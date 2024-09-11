import Pago from "../models/Pago.js";

class PagoController {
  // Crear un nuevo pago
  static async createPago(req, res) {
    const pagoData = req.body;
    try {
      const message = await Pago.createPago(pagoData);
      res.status(201).json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear pago', error });
    }
  }

  // Obtener todos los pagos
  static async getPagos(req, res) {
    try {
      const pagos = await Pago.getPagos();
      res.json(pagos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pagos', error });
    }
  }

  // Obtener un pago por ID
  static async getPagoById(req, res) {
    const { id } = req.params;
    try {
      const pago = await Pago.getPagoById(id);
      res.json(pago);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pago por ID', error });
    }
  }

  // Actualizar un pago existente
  static async updatePago(req, res) {
    const { id } = req.params;
    const updatedData = req.body;
    try {
      const message = await Pago.updatePago(id, updatedData);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar pago', error });
    }
  }

  // Eliminar un pago
  static async deletePago(req, res) {
    const { id } = req.params;
    try {
      const message = await Pago.deletePago(id);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar pago', error });
    }
  }
}

export default PagoController;
