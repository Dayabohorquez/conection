// src/controllers/fechaEspecial.controller.js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import FechaEspecial from "../models/FechaEspecial.js";

// Obtener el nombre del archivo actual y el directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FechaEspecialController {
  // Crear una nueva fecha especial
  static async createFechaEspecial(req, res) {
    try {
      const { nombre_fecha_especial, fecha } = req.body;

      // Validar que se subió un archivo
      if (!req.files || !req.files.foto) {
        return res.status(400).json({ message: 'No se subió ninguna imagen' });
      }

      const uploadedFile = req.files.foto;
      const timestamp = Date.now();
      const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
      const uploadPath = path.join(__dirname, '../uploads/img/fecha_especial/', uniqueFileName);

      // Mover el archivo subido
      await uploadedFile.mv(uploadPath);

      const message = await FechaEspecial.createFechaEspecial({
        nombre_fecha_especial,
        fecha,
        foto: uploadPath,
        fotoURL: `http://localhost:4000/uploads/img/fecha_especial/${uniqueFileName}`
      });
      return res.status(201).json({ message });
    } catch (error) {
      console.error('Error al crear fecha especial:', error);
      return res.status(500).json({ message: 'Error al crear fecha especial', error });
    }
  }

  // Obtener todas las fechas especiales
  static async getAllFechasEspeciales(req, res) {
    try {
      const fechasEspeciales = await FechaEspecial.getAllFechasEspeciales();
      res.json(fechasEspeciales);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener fechas especiales', error });
    }
  }
  
  // Obtener una fecha especial por ID
  static async getFechaEspecialById(req, res) {
    const { id } = req.params;
    try {
      const fechaEspecial = await FechaEspecial.getFechaEspecialById(id);
      if (fechaEspecial.length > 0) {
        return res.json(fechaEspecial[0]);
      } else {
        return res.status(404).json({ message: 'Fecha especial no encontrada' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener fecha especial por ID', error });
    }
  }

  // Actualizar una fecha especial por ID
  static async actualizarFechaEspecial(req, res) {
    const { id_fecha_especial } = req.params;
    const { nombre_fecha_especial, fecha } = req.body;

    try {
      const fechaEspecial = await FechaEspecial.getFechaEspecialById(id_fecha_especial);
      if (!fechaEspecial.length) {
        return res.status(404).json({ message: 'Fecha especial no encontrada' });
      }

      let fotoPath = fechaEspecial[0].foto;
      let fotoURL = fechaEspecial[0].fotoURL;

      if (req.files && req.files.foto) {
        const uploadedFile = req.files.foto;
        const timestamp = Date.now();
        const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
        fotoPath = path.join(__dirname, '../uploads/img/fecha_especial/', uniqueFileName);
        fotoURL = `http://localhost:4000/uploads/img/fecha_especial/${uniqueFileName}`;
        await uploadedFile.mv(fotoPath);
      }

      await FechaEspecial.actualizarFechaEspecial({
        id_fecha_especial,
        nombre_fecha_especial,
        fecha,
        foto: fotoPath,
        fotoURL: fotoURL
      });

      return res.status(200).json({ message: 'Fecha especial actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar fecha especial:', error);
      return res.status(500).json({ message: 'Error al actualizar fecha especial', error });
    }
  }

  // Eliminar una fecha especial por ID
  static async deleteFechaEspecial(req, res) {
    const { id } = req.params;
    try {
      const fechaEspecialExistente = await FechaEspecial.getFechaEspecialById(id);
      if (fechaEspecialExistente.length === 0) {
        return res.status(404).json({ message: 'Fecha especial no encontrada' });
      }

      if (fechaEspecialExistente[0].foto) {
        const oldImagePath = path.join(__dirname, '..', fechaEspecialExistente[0].foto);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const message = await FechaEspecial.deleteFechaEspecial(id);
      return res.json({ message });
    } catch (error) {
      return res.status(500).json({ message: 'Error al eliminar fecha especial', error });
    }
  }
}

export default FechaEspecialController;