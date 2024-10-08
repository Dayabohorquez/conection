import Producto from "../models/Producto.js";
import path from 'path';
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

  // Obtener productos por tipo de flor
  static async obtenerProductosPorTipoFlor(req, res) {
    const { tipoFlorId } = req.params; // Asegúrate de que este sea el nombre correcto
    try {
      const productos = await Producto.obtenerProductosPorTipoFlor(tipoFlorId);
      if (!productos.length) {
        return res.status(404).json({ message: 'No se encontraron productos para este tipo de flor' });
      }
      res.status(200).json(productos);
    } catch (error) {
      console.error('Error al obtener productos por tipo de flor:', error);
      res.status(500).json({ message: 'Error al obtener productos', error });
    }
  }

  static async crearProducto(req, res) {
    // Validar que se subió un archivo
    if (!req.files || !req.files.foto_Producto) {
        return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    const uploadedFile = req.files.foto_Producto;
    const timestamp = Date.now();
    const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
    const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
    const foto_ProductoURL = `http://localhost:4000/uploads/img/producto/${uniqueFileName}`;

    // Mover el archivo subido
    uploadedFile.mv(uploadPath, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al subir la imagen', error: err });
        }

        try {
            // Verificar que todos los campos requeridos estén presentes
            const {
                codigo_producto,
                nombre_producto,
                descripcion_producto,
                precio_producto,
                cantidad_disponible,
                id_tipo_flor,
                id_evento
            } = req.body;

            if (!codigo_producto || !nombre_producto || !descripcion_producto || !precio_producto ||
                !cantidad_disponible || !id_tipo_flor || !id_evento) {
                return res.status(400).json({ message: 'Faltan datos requeridos' });
            }

            const productoData = {
              codigo_producto: req.body.codigo_producto, // Debe ser un número entero
              nombre_producto: req.body.nombre_producto,
              foto_Producto: `./uploads/img/producto/${uniqueFileName}`, // Asegúrate que esto no sea null
              foto_ProductoURL,
              descripcion_producto: req.body.descripcion_producto,
              precio_producto: parseFloat(req.body.precio_producto), // Debe ser un número decimal
              cantidad_disponible: parseInt(req.body.cantidad_disponible), // Debe ser un número entero
              id_tipo_flor: parseInt(req.body.id_tipo_flor), // Debe ser un número entero
              id_evento: parseInt(req.body.id_evento) // Debe ser un número entero
          };
          

            // Depurar los datos del producto antes de la creación
            console.log('Datos del producto:', productoData);

            await Producto.crearProducto(productoData);
            res.status(201).json({ message: 'Producto creado correctamente' });
        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).json({ message: 'Error al crear producto', error });
        }
    });
}

  static async actualizarProducto(req, res) {
    const { idProducto } = req.params;

    const {
      codigo_producto,
      nombre_producto,
      descripcion_producto,
      precio_producto,
      cantidad_disponible,
      id_tipo_flor,
      id_evento,
      foto_Producto, // Aquí puedes manejar la foto
  } = req.body;

  let foto_ProductoURL = null;
  let foto_ProductoPath = null;

  if (req.files && req.files.foto_Producto) {
      const uploadedFile = req.files.foto_Producto;
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${uploadedFile.name}`;
      const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);

      await uploadedFile.mv(uploadPath);
      foto_ProductoURL = `http://localhost:4000/uploads/img/producto/${uniqueFileName}`;
      foto_ProductoPath = `./uploads/img/producto/${uniqueFileName}`;
  } else {
      // Si no hay nueva foto, mantén la foto actual
      const existingProduct = await Producto.findByPk(idProducto);
      foto_ProductoPath = existingProduct.foto_Producto; // Mantener la foto actual
      foto_ProductoURL = existingProduct.foto_ProductoURL; // Mantener la URL actual
  }

  const updatedData = {
      id_producto: idProducto,
      codigo_producto,
      nombre_producto,
      foto_Producto: foto_ProductoPath,
      foto_ProductoURL,
      descripcion_producto,
      precio_producto,
      cantidad_disponible,
      id_tipo_flor,
      id_evento,
  };

  try {
      await Producto.actualizarProducto(updatedData);
      res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ message: 'Error al actualizar producto', error });
  }
}

  // Cambiar estado de un producto (activado/desactivado)
  static async cambiarEstadoProducto(req, res) {
    const { idProducto } = req.params; // Usa `idProducto` para que coincida con el nombre en la ruta
    const { estado } = req.body;

    try {
      const producto = await Producto.obtenerProductoPorId(idProducto);
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      await Producto.cambiarEstadoProducto(idProducto, estado);
      return res.status(200).json({ message: 'Estado de producto actualizado', estado });
    } catch (error) {
      console.error('Error al cambiar estado de producto:', error);
      return res.status(500).json({ message: 'Error al cambiar estado de producto', error: error.message });
    }
  }
}

export default ProductoController;
