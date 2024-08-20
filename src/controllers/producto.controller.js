import { Producto } from "../models/producto.model.js";

// Obtener todos los productos
export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos: ' + error });
    }
};

// Obtener un producto por ID
export const getProducto = async (req, res) => {
    try {
        const id = req.params.id;
        const producto = await Producto.findByPk(id);
        if (producto) {
            res.status(200).json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto: ' + error });
    }
};

// Crear un nuevo producto
export const postProducto = async (req, res) => {
    try {
        const { nombre_producto, descripcion_producto, precio_producto, estado_producto, tipo_producto } = req.body;
        const producto = await Producto.create({
            nombre_producto,
            descripcion_producto,
            precio_producto,
            estado_producto,
            tipo_producto
        });
        res.status(201).json({ message: 'Producto creado correctamente', producto });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto: ' + error });
    }
};

// Actualizar un producto
export const putProducto = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre_producto, descripcion_producto, precio_producto, tipo_producto } = req.body;
        const [updated] = await Producto.update({
            nombre_producto,
            descripcion_producto,
            precio_producto,
            tipo_producto
        }, {
            where: { id_producto: id }
        });
        if (updated) {
            res.status(200).json({ message: 'Producto actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto: ' + error });
    }
};

// Actualizar parcialmente un producto
export const patchProducto = async (req, res) => {
    try {
        const id = req.params.id;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Alternar el estado
        const nuevoEstado = producto.estado_producto === '1' ? '0' : '1';

        await Producto.update(
            { estado_producto: nuevoEstado },
            { where: { id_producto: id } }
        );

        res.status(200).json({ message: 'Estado del producto actualizado correctamente', estado: nuevoEstado });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del producto: ' + error });
    }
};


