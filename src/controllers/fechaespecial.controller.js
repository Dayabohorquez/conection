import FechaEspecial from '../models/FechaEspecial.js';

class FechaEspecialController {
  // Crear una nueva fecha especial
  static async createFechaEspecial(req, res) {
    try {
      const { nombre_fecha_especial } = req.body;
      const result = await FechaEspecial.createFechaEspecial({ nombre_fecha_especial });
      res.status(201).json(result);
    } catch (error) {
      console.error(`Error al crear fecha especial: ${error}`);
      res.status(500).json({ message: 'Error al crear fecha especial', error: error.message });
    }
  }

  // Obtener todas las fechas especiales
  static async getAllFechasEspeciales(req, res) {
    try {
      const fechasEspeciales = await FechaEspecial.getAllFechasEspeciales();
      res.status(200).json(fechasEspeciales);
    } catch (error) {
      console.error(`Error al obtener fechas especiales: ${error}`);
      res.status(500).json({ message: 'Error al obtener fechas especiales', error: error.message });
    }
  }

  // Obtener una fecha especial por ID
  static async getFechaEspecialById(req, res) {
    try {
      const { id } = req.params;
      const fechaEspecial = await FechaEspecial.getFechaEspecialById(id);
      if (fechaEspecial.length === 0) {
        return res.status(404).json({ message: 'Fecha especial no encontrada' });
      }
      res.status(200).json(fechaEspecial);
    } catch (error) {
      console.error(`Error al obtener fecha especial: ${error}`);
      res.status(500).json({ message: 'Error al obtener fecha especial', error: error.message });
    }
  }

  // Actualizar una fecha especial
  static async actualizarFechaEspecial(req, res) {
    try {
      const { id_fecha_especial, nombre_fecha_especial } = req.body;
      await FechaEspecial.actualizarFechaEspecial({ id_fecha_especial, nombre_fecha_especial });
      res.status(200).json({ message: 'Fecha especial actualizada exitosamente' });
    } catch (error) {
      console.error(`Error al actualizar fecha especial: ${error}`);
      res.status(500).json({ message: 'Error al actualizar fecha especial', error: error.message });
    }
  }

  // Eliminar una fecha especial
  static async deleteFechaEspecial(req, res) {
    try {
      const { id } = req.params;
      await FechaEspecial.deleteFechaEspecial(id);
      res.status(200).json({ message: 'Fecha especial eliminada exitosamente' });
    } catch (error) {
      console.error(`Error al eliminar fecha especial: ${error}`);
      res.status(500).json({ message: 'Error al eliminar fecha especial', error: error.message });
    }
  }
}

export default FechaEspecialController;
