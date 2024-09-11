// src/controllers/producto.controller.js
import Producto from "../models/Producto.js";

class ProductoController {
  // Obtener todos los productos
  static async obtenerProductos(req, res) {
    try {
      const productos = await Producto.getAllProductos(); // Asegúrate de que esta función esté en el modelo
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener productos', error });
    }
  }

  // Obtener producto por ID
  static async obtenerProductoPorId(req, res) {
    const { idProducto } = req.params;
    try {
      const producto = await Producto.getProductoById(idProducto);
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(producto);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener producto', error });
    }
  }

  // Crear nuevo producto
  static async crearProducto(req, res) {
    try {
      const { nombre_producto, descripcion_producto, precio_producto, estado_producto, tipo_producto } = req.body;

      // Manejo del archivo de imagen
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
            nombre_producto,
            descripcion_producto,
            precio_producto,
            estado_producto,
            tipo_producto,
            foto_Producto: `./uploads/img/producto/${uniqueFileName}`,
            foto_ProductoURL
          };
  
          await Producto.createProducto(productoData);
          res.status(201).json({ message: 'Producto creado correctamente' });
        } catch (error) {
          res.status(500).json({ message: 'Error al crear producto', error });
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear producto', error });
    }
  }

  // Actualizar un producto
  static async actualizarProducto(req, res) {
    const { idProducto } = req.params;
    const productoData = req.body;

    try {
      const productoExistente = await Producto.getProductoById(idProducto);
      if (!productoExistente) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      if (req.files && req.files.foto_Producto) {
        const uploadedFile = req.files.foto_Producto;
        const timestamp = Date.now();
        const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
        const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
        const foto_ProductoURL = `http://localhost:4000/uploads/img/producto/${uniqueFileName}`;

        uploadedFile.mv(uploadPath, async (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error al mover el archivo', error: err });
          }

          if (productoExistente.foto_Producto) {
            const oldImagePath = path.join(__dirname, '..', productoExistente.foto_Producto);
            if (fs.existsSync(oldImagePath)) {
              try {
                fs.unlinkSync(oldImagePath);
                console.log('Imagen anterior eliminada:', oldImagePath);
              } catch (unlinkError) {
                console.error('Error al eliminar la imagen anterior:', unlinkError);
              }
            }
          }

          productoData.foto_Producto = `./uploads/img/producto/${uniqueFileName}`;
          productoData.foto_ProductoURL = foto_ProductoURL;

          try {
            await Producto.updateProducto(idProducto, productoData);
            res.status(200).json({ message: 'Producto actualizado correctamente' });
          } catch (error) {
            res.status(500).json({ message: 'Error al actualizar producto', error });
          }
        });
      } else {
        // Actualizar el producto sin cambiar la imagen
        try {
          await Producto.updateProducto(idProducto, productoData);
          res.status(200).json({ message: 'Producto actualizado correctamente' });
        } catch (error) {
          res.status(500).json({ message: 'Error al actualizar producto', error });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar producto', error });
    }
  }

  // Cambiar estado de un producto (activado/desactivado)
  static async cambiarEstadoProducto(req, res) {
    const { idProducto } = req.params;
    try {
      const message = await Producto.toggleProductoState(idProducto);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar estado de producto', error });
    }
  }

  // Eliminar un producto
  static async eliminarProducto(req, res) {
    const { idProducto } = req.params;
    try {
      const productoExistente = await Producto.getProductoById(idProducto);
      if (!productoExistente) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      await Producto.deleteProducto(idProducto);
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar producto', error });
    }
  }
}

export default ProductoController;
