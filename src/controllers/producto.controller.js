import Producto from "../models/Producto.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtener el nombre del archivo actual y el directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductoController {
  // Obtener todos los productos
  static async obtenerProductos(req, res) {
    try {
      const productos = await Producto.obtenerProductos();
      res.status(200).json(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ message: 'Error al obtener productos', error });
    }
  }

  // Obtener producto por ID
  static async obtenerProductoPorId(req, res) {
    const { idProducto } = req.params;
    try {
      const producto = await Producto.obtenerProductoPorId(idProducto);
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json(producto);
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      res.status(500).json({ message: 'Error al obtener producto', error });
    }
  }

  static async crearProducto(req, res) {
    if (!req.files || !req.files.foto_Producto) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    const uploadedFile = req.files.foto_Producto;
    const timestamp = Date.now();
    const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
    const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
    const foto_ProductoURL = `http://localhost:4000/uploads/img/producto/${uniqueFileName}`;

    uploadedFile.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al subir la imagen', error: err });
      }

      try {
        const productoData = {
          codigoProducto: req.body.codigo_producto,
          nombreProducto: req.body.nombre_producto,
          fotoProducto: `./uploads/img/producto/${uniqueFileName}`,
          foto_ProductoURL, // Asegúrate de usar el nombre correcto aquí
          descripcionProducto: req.body.descripcion_producto,
          precioProducto: req.body.precio_producto,
          estadoProducto: req.body.estado_producto,
          cantidadDisponible: req.body.cantidad_disponible,
          idTipoFlor: req.body.id_tipo_flor,
          idEvento: req.body.id_evento
        };

        await Producto.crearProducto(productoData);
        res.status(201).json({ message: 'Producto creado correctamente' });
      } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error al crear producto', error });
      }
    });
  }

  // Actualizar un producto
  static async actualizarProducto(req, res) {
    const { idProducto } = req.params;
    const productoData = req.body;
  
    try {
      const productoExistente = await Producto.obtenerProductoPorId(idProducto);
      if (!productoExistente) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      if (req.files && req.files.foto_producto) {
        const uploadedFile = req.files.foto_producto;
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}_${uploadedFile.name}`;
        const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
        const foto_productoURL = `http://localhost:4000/uploads/img/producto/${uniqueFileName}`;
  
        uploadedFile.mv(uploadPath, async (err) => {
          if (err) {
            console.error('Error al mover el archivo:', err);
            return res.status(500).json({ message: 'Error al mover el archivo', error: err });
          }
  
          // Eliminar imagen anterior si existe
          if (productoExistente.foto_producto) {
            const oldImagePath = path.join(__dirname, '..', productoExistente.foto_producto);
            if (fs.existsSync(oldImagePath)) {
              try {
                fs.unlinkSync(oldImagePath);
                console.log('Imagen anterior eliminada:', oldImagePath);
              } catch (unlinkError) {
                console.error('Error al eliminar la imagen anterior:', unlinkError);
              }
            }
          }
  
          productoData.foto_producto = `./uploads/img/producto/${uniqueFileName}`;
          productoData.foto_ProductoURL = foto_productoURL;
  
          try {
            await Producto.actualizarProducto({
              idProducto,
              codigoProducto: productoData.codigoProducto,
              nombreProducto: productoData.nombreProducto,
              fotoProducto: productoData.foto_producto,
              foto_ProductoURL: productoData.foto_ProductoURL,
              descripcionProducto: productoData.descripcionProducto,
              precioProducto: productoData.precioProducto,
              estadoProducto: productoData.estadoProducto,
              cantidadDisponible: productoData.cantidadDisponible,
              idTipoFlor: productoData.idTipoFlor,
              idEvento: productoData.idEvento
            });
            res.status(200).json({ message: 'Producto actualizado correctamente' });
          } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({ message: 'Error al actualizar producto', error });
          }
        });
      } else {
        try {
          await Producto.actualizarProducto({
            idProducto,
            codigoProducto: productoData.codigoProducto,
            nombreProducto: productoData.nombreProducto,
            fotoProducto: productoData.foto_producto,
            foto_ProductoURL: productoData.foto_ProductoURL,
            descripcionProducto: productoData.descripcionProducto,
            precioProducto: productoData.precioProducto,
            estadoProducto: productoData.estadoProducto,
            cantidadDisponible: productoData.cantidadDisponible,
            idTipoFlor: productoData.idTipoFlor,
            idEvento: productoData.idEvento
          });
          res.status(200).json({ message: 'Producto actualizado correctamente' });
        } catch (error) {
          console.error('Error al actualizar producto:', error);
          res.status(500).json({ message: 'Error al actualizar producto', error });
        }
      }
    } catch (error) {
      console.error('Error en la actualización de producto:', error);
      res.status(500).json({ message: 'Error al actualizar producto', error });
    }
  }

  // Cambiar estado de un producto (activado/desactivado)
  static async cambiarEstadoProducto(req, res) {
    const { idProducto } = req.params;
    try {
      await Producto.cambiarEstadoProducto(idProducto);
      res.status(200).json({ message: 'Estado de producto actualizado' });
    } catch (error) {
      console.error('Error al cambiar estado de producto:', error);
      res.status(500).json({ message: 'Error al cambiar estado de producto', error });
    }
  }
}

export default ProductoController;
