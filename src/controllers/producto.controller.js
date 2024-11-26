import path from 'path';
import { fileURLToPath } from 'url';
<<<<<<< HEAD
import Producto from "../models/Producto.js";
=======
import fs from 'fs';
>>>>>>> 6358a67a974df0e3611f7d0dcde6c5738374d095

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
    const { id } = req.params;

    try {
      const producto = await Producto.obtenerProductoPorId(id);

      if (!producto || producto.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      return res.status(200).json(producto);
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      return res.status(500).json({ message: 'Error al obtener el producto', error });
    }
  }

  // Obtener productos por tipo de flor
  static async obtenerProductosPorTipoFlor(req, res) {
    const { tipoFlorId } = req.params;
    const limit = parseInt(req.query.limit) || 5;  // Límite por defecto a 5
    const offset = parseInt(req.query.offset) || 0; // Desplazamiento por defecto a 0
    try {
      const productos = await Producto.obtenerProductosPorTipoFlor(tipoFlorId, limit, offset);
      if (!productos.length) {
        return res.status(404).json({ message: 'No se encontraron productos para este tipo de flor' });
      }
      res.status(200).json(productos);
    } catch (error) {
      console.error('Error al obtener productos por tipo de flor:', error);
      res.status(500).json({ message: 'Error al obtener productos', error });
    }
  }

  // Obtener productos por fecha especial
  static async obtenerProductosPorFechaEspecial(req, res) {
    const { fechaEspecialId } = req.params;
    const limit = parseInt(req.query.limit) || 5;  // Límite por defecto a 5
    const offset = parseInt(req.query.offset) || 0; // Desplazamiento por defecto a 0
    try {
      const productos = await Producto.obtenerProductosPorFechaEspecial(fechaEspecialId, limit, offset);
      if (!productos.length) {
        return res.status(404).json({ message: 'No se encontraron productos para esta fecha especial' });
      }
      res.status(200).json(productos);
    } catch (error) {
      console.error('Error al obtener productos por fecha especial:', error);
      res.status(500).json({ message: 'Error al obtener productos', error });
    }
  }

  // Crear un nuevo producto
  static async crearProducto(req, res) {
    // Validar que se subió un archivo
    if (!req.files || !req.files.foto_Producto) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    const uploadedFile = req.files.foto_Producto;
    const timestamp = Date.now();
    const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
    const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
    const foto_ProductoURL = `https://conection-gap0.onrender.com/uploads/img/producto/${uniqueFileName}`;

    // Imprimir información del archivo para depurar
    console.log('Archivo recibido:', uploadedFile.name);
    console.log('Ruta de subida:', uploadPath);

    // Mover el archivo subido
    uploadedFile.mv(uploadPath, async (err) => {
      if (err) {
        console.error('Error al mover el archivo:', err);
        return res.status(500).json({ message: 'Error al subir la imagen', error: err });
      }

<<<<<<< HEAD
      const uploadedFile = req.files.foto_Producto;
      const timestamp = Date.now();
      const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
      const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
      const foto_ProductoURL = `http://localhost:4000/uploads/img/producto/${uniqueFileName}`;
=======
      // Si el archivo se movió correctamente, procedemos con la creación del producto
      try {
        // Imprimir el cuerpo de la solicitud para depurar los datos recibidos
        console.log('Datos recibidos del producto:', req.body);
>>>>>>> 6358a67a974df0e3611f7d0dcde6c5738374d095

        const {
          codigo_producto,
          nombre_producto,
          descripcion_producto,
          precio_producto,
          cantidad_disponible,
          id_tipo_flor,
          id_evento,
          id_fecha_especial
        } = req.body;

        if (!codigo_producto || !nombre_producto || !descripcion_producto || !precio_producto ||
          !cantidad_disponible || !id_tipo_flor || !id_evento || !id_fecha_especial) {
          return res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        // Crear el objeto del producto con los datos
        const productoData = {
          codigo_producto: parseInt(codigo_producto),
          nombre_producto,
          foto_Producto: `./uploads/img/producto/${uniqueFileName}`,
          foto_ProductoURL,
          descripcion_producto,
          precio_producto: parseFloat(precio_producto),
          cantidad_disponible: parseInt(cantidad_disponible),
          id_tipo_flor: parseInt(id_tipo_flor),
          id_evento: parseInt(id_evento),
          id_fecha_especial: parseInt(id_fecha_especial)
        };

        // Depurar los datos del producto antes de la creación
        console.log('Producto a crear:', productoData);

        // Verificar si Producto.crearProducto está disponible y lo ejecuta correctamente
        const result = await Producto.crearProducto(productoData);
        if (!result) {
          console.error('Error al insertar el producto en la base de datos');
          return res.status(500).json({ message: 'Error al insertar el producto en la base de datos' });
        }

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
    
      const {
        codigo_producto,
        nombre_producto,
        descripcion_producto,
        precio_producto,
        id_tipo_flor,
        id_evento,
        id_fecha_especial,
      } = req.body;
    
      let foto_ProductoURL = null;
      let foto_ProductoPath = null;
    
      if (req.files && req.files.foto_Producto) {
        const uploadedFile = req.files.foto_Producto;
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}_${uploadedFile.name}`;
        const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
    
        await uploadedFile.mv(uploadPath);
<<<<<<< HEAD
        foto_ProductoURL = `http://localhost:4000/uploads/img/producto/${uniqueFileName}`;
=======
        foto_ProductoURL = `https://conection-gap0.onrender.com/uploads/img/producto/${uniqueFileName}`;
>>>>>>> 6358a67a974df0e3611f7d0dcde6c5738374d095
        foto_ProductoPath = `./uploads/img/producto/${uniqueFileName}`;
      } else {
        // Si no hay nueva foto, mantener la foto actual
        const existingProduct = await Producto.obtenerProductoPorId(idProducto);
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
        id_tipo_flor,
        id_evento,
        id_fecha_especial
      };
    
      try {
        await Producto.actualizarProducto(updatedData);
        res.json({ message: 'Producto actualizado correctamente' });
      } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar producto', error });
      }
    }  

  static async actualizarCantidad(req, res) {
    const { idProducto } = req.params;
    const { nuevaCantidad } = req.body;

    try {
        const producto = await Producto.obtenerProductoPorId(idProducto);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Aquí puedes validar que la nueva cantidad sea válida
        if (nuevaCantidad < 0) {
            return res.status(400).json({ message: 'La cantidad no puede ser negativa' });
        }

        await Producto.actualizarCantidadDisponible(idProducto, nuevaCantidad);
        return res.status(200).json({ message: 'Cantidad disponible actualizada', nuevaCantidad });
    } catch (error) {
        console.error('Error al actualizar cantidad de producto:', error);
        return res.status(500).json({ message: 'Error al actualizar cantidad de producto', error: error.message });
    }
}

  // Cambiar estado de un producto (activado/desactivado)
  static async cambiarEstadoProducto(req, res) {
    const { idProducto } = req.params;
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
