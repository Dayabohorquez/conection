import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { sequelize } from '../config/db.js';
import { QueryTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductoController {
    // Obtener todos los productos
static async getProductos(req, res) {
    try {
        const productos = await sequelize.query('CALL GetProductos()', { type: QueryTypes.RAW });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
}

    // Obtener un producto por ID
static async getProductoById(req, res) {
    const { id } = req.params;
    try {
        const result = await sequelize.query('CALL GetProductoById(:id)', {
            replacements: { id },
            type: QueryTypes.RAW
        });
        const producto = result[0];
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
}
    
    // Crear un nuevo producto
    static async postProducto(req, res) {
        try {
            console.log('Headers:', req.headers);
            console.log('Files:', req.files);
            console.log('Body:', req.body);

            if (!req.files || !req.files.foto_Producto) {
                return res.status(400).json({ message: 'No se subió ningún archivo' });
            }

            const uploadedFile = req.files.foto_Producto;
            const timestamp = Date.now();
            const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
            const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
            const fotoProductoURL = `http://localhost:4000/uploads/img/producto/${uniqueFileName}`;

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

                await sequelize.query(
                    'CALL CreateProducto(:nombre_producto, :descripcion_producto, :precio_producto, :estado_producto, :tipo_producto, :foto_Producto, :foto_ProductoURL)',
                    {
                        replacements: p,
                        type: QueryTypes.RAW
                    }
                );
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
            const productoExistente = await sequelize.query('CALL GetProductoById(:producto_id)', {
                replacements: { producto_id: id },
                type: QueryTypes.SELECT
            });

            if (productoExistente.length === 0) {
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
                        return res.status(500).json({ message: 'Error al mover el archivo: ' + err });
                    }

                    if (productoExistente[0].foto_Producto) {
                        const oldImagePath = path.join(__dirname, '..', productoExistente[0].foto_Producto);
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
                        nombre_producto: req.body.nombre_producto,
                        descripcion_producto: req.body.descripcion_producto,
                        precio_producto: req.body.precio_producto,
                        estado_producto: req.body.estado_producto,
                        tipo_producto: req.body.tipo_producto,
                        foto_Producto: `./uploads/img/producto/${uniqueFileName}`,
                        foto_ProductoURL
                    };

                    await sequelize.query(
                        'CALL UpdateProducto(:producto_id, :nombre_producto, :descripcion_producto, :precio_producto, :estado_producto, :tipo_producto, :foto_Producto, :foto_ProductoURL)',
                        {
                            replacements: { producto_id: id, ...updatedProducto },
                            type: QueryTypes.RAW
                        }
                    );
                    res.status(200).json({ message: 'Producto actualizado correctamente' });
                });
            } else {
                await sequelize.query(
                    'CALL UpdateProducto(:producto_id, :nombre_producto, :descripcion_producto, :precio_producto, :estado_producto, :tipo_producto, :foto_Producto, :foto_ProductoURL)',
                    {
                        replacements: {
                            producto_id: id,
                            nombre_producto: req.body.nombre_producto,
                            descripcion_producto: req.body.descripcion_producto,
                            precio_producto: req.body.precio_producto,
                            estado_producto: req.body.estado_producto,
                            tipo_producto: req.body.tipo_producto,
                            foto_Producto: productoExistente[0].foto_Producto,
                            foto_ProductoURL: productoExistente[0].foto_ProductoURL
                        },
                        type: QueryTypes.RAW
                    }
                );
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
            await sequelize.query('CALL ToggleProductoState(:producto_id)', {
                replacements: { producto_id: id },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Estado del producto actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el estado del producto: ' + error });
        }
    }
}

// Exportar el controlador
export default ProductoController;