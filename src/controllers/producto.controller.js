import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Producto } from '../models/producto.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductoController {
    // Obtener todos los productos
    static async getProductos(req, res) {
        try {
            const productos = await Producto.getProductos();
            res.status(200).json(productos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los productos: ' + error });
        }
    }

    // Obtener un producto por ID
    static async getProducto(req, res) {
        try {
            const id = req.params.id;
            const producto = await Producto.getProductoById(id);
            if (producto) {
                res.status(200).json(producto);
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el producto: ' + error });
        }
    }

    // Crear un nuevo producto
    static async postProducto(req, res) {
        try {
            console.log(req)
            console.log('req.files:', req.files);
            console.log('req.body:', req.body);

            if (!req.files || !req.files.foto_Producto) {
                return res.status(400).json({ message: 'No se subió ningún archivo' });
            }

            const uploadedFile = req.files.foto_Producto;
            const timestamp = Date.now();
            const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
            const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
            const fotoProductoURL = `http://localhost:4001/uploads/img/producto/${uniqueFileName}`;

            uploadedFile.mv(uploadPath, async (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al subir la imagen: ' + err });
                }

                const p = {
                    nombre_producto: req.body.nombre_producto,
                    descripcion_producto: req.body.descripcion_producto,
                    precio_producto: req.body.precio_producto,
                    estado_producto: req.body.estado_producto,
                    tipo_producto: req.body.tipo_producto,
                    foto_Producto: `./uploads/img/producto/${uniqueFileName}`,
                    foto_ProductoURL: fotoProductoURL
                };

                await Producto.createProducto(p);
                return res.status(200).json({ message: 'Producto creado correctamente' });
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error al crear el producto: ' + error });
        }
    }

    // Actualizar un producto
    static async putProducto(req, res) {
        try {
            const id = req.params.id;
            const producto = await Producto.getProductoById(id);

            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            if (req.files && req.files.foto_Producto) {
                const uploadedFile = req.files.foto_Producto;
                const timestamp = Date.now();
                const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
                const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
                const foto_ProductoURL = `http://localhost:4001/uploads/img/producto/${uniqueFileName}`;

                uploadedFile.mv(uploadPath, async (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error al mover el archivo: ' + err });
                    }

                    if (producto.foto_Producto) {
                        const oldImagePath = path.join(__dirname, '..', producto.foto_Producto);
                        if (fs.existsSync(oldImagePath)) {
                            try {
                                fs.unlinkSync(oldImagePath);
                                console.log('Imagen anterior eliminada:', oldImagePath);
                            } catch (unlinkError) {
                                console.error('Error al eliminar la imagen anterior:', unlinkError);
                            }
                        }
                    }

                    const updatedProducto = {
                        ...req.body,
                        foto_Producto: `./uploads/img/producto/${uniqueFileName}`,
                        foto_ProductoURL
                    };

                    await Producto.updateProducto(id, updatedProducto);
                    res.status(200).json({ message: 'Producto actualizado correctamente' });
                });
            } else {
                await Producto.updateProducto(id, req.body);
                res.status(200).json({ message: 'Producto actualizado correctamente' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el producto: ' + error });
        }
    }

    // Alternar el estado del producto
    static async patchProducto(req, res) {
        try {
            const id = req.params.id;
            await Producto.toggleProductoState(id);
            res.status(200).json({ message: 'Estado del producto actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el estado del producto: ' + error });
        }
    }
}

export default ProductoController;
