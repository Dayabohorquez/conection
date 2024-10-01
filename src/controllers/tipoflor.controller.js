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
      res.status(500).json({ message: 'Error al obtener tipos de flores', error: error.message });
    }
  }

  // Obtener tipo de flor por ID
  static async getTipoFlorById(req, res) {
    const { id } = req.params;
    try {
      const tipoFlor = await TipoFlor.getTipoFlorById(id);
      if (!tipoFlor || tipoFlor.length === 0) {
        return res.status(404).json({ message: 'Tipo de flor no encontrado' });
      }
      res.json(tipoFlor[0]); // Ajuste si `tipoFlor` es un array
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener tipo de flor', error: error.message });
    }
  }

  // Crear nuevo tipo de flor
  static async createTipoFlor(req, res) {
    // Validar que se subió un archivo
    if (!req.files || !req.files.foto_tipo_flor) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    const uploadedFile = req.files.foto_tipo_flor;
    const timestamp = Date.now();
    const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
    const uploadPath = path.join(__dirname, '../uploads/img/tipo_flor/', uniqueFileName);
    const foto_tipo_florURL = `http://localhost:4000/uploads/img/tipo_flor/${uniqueFileName}`;

    // Mover el archivo subido
    uploadedFile.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al subir la imagen', error: err });
      }

      try {
        // Validar que todos los campos requeridos estén presentes
        const { nombre_tipo_flor } = req.body;
        if (!nombre_tipo_flor) {
          return res.status(400).json({ message: 'Falta el nombre del tipo de flor' });
        }

        const tipoFlorData = {
          nombre_tipo_flor,
          foto_tipo_flor: `./uploads/img/tipo_flor/${uniqueFileName}`,
          foto_tipo_florURL,
        };

        await TipoFlor.createTipoFlor(tipoFlorData);
        res.status(201).json({ message: 'Tipo de flor creado correctamente' });
      } catch (error) {
        console.error('Error al crear tipo de flor:', error);
        res.status(500).json({ message: 'Error al crear tipo de flor', error });
      }
    });
  }

  // Actualizar tipo de flor
  static async updateTipoFlor(req, res) {
    const { id_tipo_flor } = req.params;

    try {
      const tipoFlorExistente = await TipoFlor.getTipoFlorById(id_tipo_flor);
      if (!tipoFlorExistente || tipoFlorExistente.length === 0) {
        return res.status(404).json({ message: 'Tipo de flor no encontrado' });
      }

      let updatedData = { nombre_tipo_flor: req.body.nombre_tipo_flor };

      if (req.files && req.files.foto_tipo_flor) {
        const uploadedFile = req.files.foto_tipo_flor;
        const timestamp = Date.now();
        const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
        const uploadPath = path.join(__dirname, '../uploads/img/tipo_flor/', uniqueFileName);
        const foto_tipo_florURL = `http://localhost:4000/uploads/img/tipo_flor/${uniqueFileName}`;

        // Mover el archivo subido
        await uploadedFile.mv(uploadPath);

        // Eliminar la imagen anterior
        const oldImagePath = path.join(__dirname, '..', tipoFlorExistente[0].foto_tipo_flor);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('Imagen anterior eliminada:', oldImagePath);
        }

        updatedData = {
          ...updatedData,
          foto_tipo_flor: `./uploads/img/tipo_flor/${uniqueFileName}`,
          foto_tipo_florURL,
        };
      }

      await TipoFlor.updateTipoFlor(id_tipo_flor, updatedData);
      res.status(200).json({ message: 'Tipo de flor actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar tipo de flor:', error);
      res.status(500).json({ message: 'Error al actualizar tipo de flor', error });
    }
  }

  // Eliminar tipo de flor
  static async deleteTipoFlor(req, res) {
    const { id } = req.params;
    try {
      const tipoFlorExistente = await TipoFlor.getTipoFlorById(id);
      if (!tipoFlorExistente || tipoFlorExistente.length === 0) {
        return res.status(404).json({ message: 'Tipo de flor no encontrado' });
      }

      // Eliminar la imagen asociada
      if (tipoFlorExistente[0].foto_tipo_flor) {
        const oldImagePath = path.join(__dirname, '..', tipoFlorExistente[0].foto_tipo_flor);
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
      res.status(500).json({ message: 'Error al eliminar tipo de flor', error: error.message });
    }
  }
}

export default TipoFlorController;
