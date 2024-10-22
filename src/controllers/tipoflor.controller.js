import TipoFlor from '../models/TipoFlor.js';

class TipoFlorController {
  // Obtener todos los tipos de flor
  static async getTiposFlor(req, res) {
    try {
      const tiposFlor = await TipoFlor.getTiposFlor();
      if (!Array.isArray(tiposFlor) || tiposFlor.length === 0) {
        return res.status(404).json({ message: 'No se encontraron tipos de flor' });
      }
      res.json(tiposFlor);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener tipos de flor', error });
    }
  }

  // Obtener un tipo de flor por ID
  static async getTipoFlorById(req, res) {
    const { id } = req.params;

    try {
      const tipoFlor = await TipoFlor.getTipoFlorById(id);
      if (!tipoFlor) {
        return res.status(404).json({ message: 'Tipo de flor no encontrado' });
      }
      res.json(tipoFlor);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener tipo de flor', error });
    }
  }

  // Crear un nuevo tipo de flor
  static async postTipoFlor(req, res) {
    const { nombre_tipo_flor } = req.body;

    if (!nombre_tipo_flor) {
      return res.status(400).json({ message: 'El nombre del tipo de flor es requerido.' });
    }

    try {
      const message = await TipoFlor.createTipoFlor({ nombre_tipo_flor });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear tipo de flor', error });
    }
  }

  static async putTipoFlor(req, res) {
    const { id_tipo_flor } = req.params;
    const { nombre_tipo_flor } = req.body;

    try {
      const result = await TipoFlor.updateTipoFlor(id_tipo_flor, { nombre_tipo_flor });
      return res.json(result);
    } catch (error) {
      console.error('Error en la actualización:', error);
      return res.status(500).json({ message: 'Error al actualizar tipo de flor', error });
    }
  }

  // Eliminar un tipo de flor
  static async deleteTipoFlor(req, res) {
    const { id } = req.params;

    try {
      const tipoFlorExistente = await TipoFlor.getTipoFlorById(id);
      if (!tipoFlorExistente) {
        return res.status(404).json({ message: 'Tipo de flor no encontrado' });
      }

      const message = await TipoFlor.deleteTipoFlor(id);
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar tipo de flor', error });
    }
  }
}

export default TipoFlorController;
