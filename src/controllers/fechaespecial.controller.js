// src/controllers/fechaEspecial.controller.js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import FechaEspecial from "../models/FechaEspecial.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FechaEspecialController {
  // Crear una nueva fecha especial
  static async createFechaEspecial(req, res) {
    try {
      const { nombre, fecha } = req.body;

      if (!req.files || !req.files.foto) {
        return res.status(400).json({ message: 'No se subió ninguna imagen' });
      }

      const uploadedFile = req.files.foto;
      const timestamp = Date.now();
      const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
      const uploadPath = path.join(__dirname, '../uploads/img/fecha_especial/', uniqueFileName);
      const fotoURL = `http://localhost:4000/uploads/img/fecha_especial/${uniqueFileName}`;

      uploadedFile.mv(uploadPath, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error al subir la imagen', error: err });
        }

        try {
          const message = await FechaEspecial.createFechaEspecial(nombre, fecha, `./uploads/img/fecha_especial/${uniqueFileName}`, fotoURL);
          res.status(201).json({ message });
        } catch (error) {
          res.status(500).json({ message: 'Error al crear fecha especial', error });
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear fecha especial', error });
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
        res.json(fechaEspecial[0]);
      } else {
        res.status(404).json({ message: 'Fecha especial no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener fecha especial por ID', error });
    }
  }

  // Actualizar una fecha especial por ID
  static async updateFechaEspecial(req, res) {
    const { id } = req.params;
    const { nombre, fecha } = req.body;

    try {
      const fechaEspecialExistente = await FechaEspecial.getFechaEspecialById(id);
      if (fechaEspecialExistente.length === 0) {
        return res.status(404).json({ message: 'Fecha especial no encontrada' });
      }

      let updatedData = { nombre, fecha };

      if (req.files && req.files.foto) {
        const uploadedFile = req.files.foto;
        const timestamp = Date.now();
        const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
        const uploadPath = path.join(__dirname, '../uploads/img/fecha_especial/', uniqueFileName);
        const fotoURL = `http://localhost:4000/uploads/img/fecha_especial/${uniqueFileName}`;

        uploadedFile.mv(uploadPath, async (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error al mover el archivo', error: err });
          }

          if (fechaEspecialExistente[0].foto) {
            const oldImagePath = path.join(__dirname, '..', fechaEspecialExistente[0].foto);
            if (fs.existsSync(oldImagePath)) {
              try {
                fs.unlinkSync(oldImagePath);
                console.log('Imagen anterior eliminada:', oldImagePath);
              } catch (unlinkError) {
                console.error('Error al eliminar la imagen anterior:', unlinkError);
              }
            }
          }

          updatedData = { ...updatedData, foto: `./uploads/img/fecha_especial/${uniqueFileName}`, fotoURL };

          try {
            const message = await FechaEspecial.updateFechaEspecial(id, updatedData);
            res.status(200).json({ message });
          } catch (error) {
            res.status(500).json({ message: 'Error al actualizar fecha especial', error });
          }
        });
      } else {
        // Actualizar la fecha especial sin cambiar la imagen
        try {
          const message = await FechaEspecial.updateFechaEspecial(id, updatedData);
          res.status(200).json({ message });
        } catch (error) {
          res.status(500).json({ message: 'Error al actualizar fecha especial', error });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar fecha especial', error });
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

      // Eliminar la imagen asociada
      if (fechaEspecialExistente[0].foto) {
        const oldImagePath = path.join(__dirname, '..', fechaEspecialExistente[0].foto);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log('Imagen eliminada:', oldImagePath);
          } catch (unlinkError) {
            console.error('Error al eliminar la imagen:', unlinkError);
          }
        }
      }

      const message = await FechaEspecial.deleteFechaEspecial(id);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar fecha especial', error });
    }
  }
}

export default FechaEspecialController;