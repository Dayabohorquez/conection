// src/controllers/tipoFlor.controller.js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import TipoFlor from "../models/TipoFlor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TipoFlorController {
  // Obtener todos los tipos de flores
  static async getTiposFlor(req, res) {
    try {
      const tiposFlor = await TipoFlor.getTiposFlor();
      res.json(tiposFlor);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener tipos de flores', error });
    }
  }

  // Obtener tipo de flor por ID
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

  // Crear nuevo tipo de flor
  static async createTipoFlor(req, res) {
    try {
      const { nombre_tipo_flor } = req.body;

      // Manejo del archivo de imagen
      if (!req.files || !req.files.foto_tipo_flor) {
        return res.status(400).json({ message: 'No se subió ninguna imagen' });
      }

      const uploadedFile = req.files.foto_tipo_flor;
      const timestamp = Date.now();
      const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
      const uploadPath = path.join(__dirname, '../uploads/img/tipo_flor/', uniqueFileName);
      const foto_tipo_florURL = `http://localhost:4000/uploads/img/tipo_flor/${uniqueFileName}`;

      uploadedFile.mv(uploadPath, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error al subir la imagen', error: err });
        }

        try {
          const tipoFlorData = {
            nombre_tipo_flor,
            foto_tipo_flor: `./uploads/img/tipo_flor/${uniqueFileName}`,
            foto_tipo_florURL
          };

          await TipoFlor.createTipoFlor(tipoFlorData);
          res.status(201).json({ message: 'Tipo de flor creado correctamente' });
        } catch (error) {
          res.status(500).json({ message: 'Error al crear tipo de flor', error });
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear tipo de flor', error });
    }
  }

  // Actualizar tipo de flor
  static async updateTipoFlor(req, res) {
    const { id } = req.params;
    const { nombre_tipo_flor } = req.body;

    try {
      const tipoFlorExistente = await TipoFlor.getTipoFlorById(id);
      if (!tipoFlorExistente) {
        return res.status(404).json({ message: 'Tipo de flor no encontrado' });
      }

      let updatedData = { nombre_tipo_flor };

      if (req.files && req.files.foto_tipo_flor) {
        const uploadedFile = req.files.foto_tipo_flor;
        const timestamp = Date.now();
        const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
        const uploadPath = path.join(__dirname, '../uploads/img/tipo_flor/', uniqueFileName);
        const foto_tipo_florURL = `http://localhost:4000/uploads/img/tipo_flor/${uniqueFileName}`;

        uploadedFile.mv(uploadPath, async (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error al mover el archivo', error: err });
          }

          if (tipoFlorExistente.foto_tipo_flor) {
            const oldImagePath = path.join(__dirname, '..', tipoFlorExistente.foto_tipo_flor);
            if (fs.existsSync(oldImagePath)) {
              try {
                fs.unlinkSync(oldImagePath);
                console.log('Imagen anterior eliminada:', oldImagePath);
              } catch (unlinkError) {
                console.error('Error al eliminar la imagen anterior:', unlinkError);
              }
            }
          }

          updatedData = { ...updatedData, foto_tipo_flor: `./uploads/img/tipo_flor/${uniqueFileName}`, foto_tipo_florURL };

          try {
            await TipoFlor.updateTipoFlor(id, updatedData);
            res.status(200).json({ message: 'Tipo de flor actualizado correctamente' });
          } catch (error) {
            res.status(500).json({ message: 'Error al actualizar tipo de flor', error });
          }
        });
      } else {
        // Actualizar el tipo de flor sin cambiar la imagen
        try {
          await TipoFlor.updateTipoFlor(id, updatedData);
          res.status(200).json({ message: 'Tipo de flor actualizado correctamente' });
        } catch (error) {
          res.status(500).json({ message: 'Error al actualizar tipo de flor', error });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar tipo de flor', error });
    }
  }

  // Eliminar tipo de flor
  static async deleteTipoFlor(req, res) {
    const { id } = req.params;
    try {
      const tipoFlorExistente = await TipoFlor.getTipoFlorById(id);
      if (!tipoFlorExistente) {
        return res.status(404).json({ message: 'Tipo de flor no encontrado' });
      }

      // Eliminar la imagen asociada
      if (tipoFlorExistente.foto_tipo_flor) {
        const oldImagePath = path.join(__dirname, '..', tipoFlorExistente.foto_tipo_flor);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log('Imagen eliminada:', oldImagePath);
          } catch (unlinkError) {
            console.error('Error al eliminar la imagen:', unlinkError);
          }
        }
      }

      await TipoFlor.deleteTipoFlor(id);
      res.json({ message: 'Tipo de flor eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar tipo de flor', error });
    }
  }
}

export default TipoFlorController;
