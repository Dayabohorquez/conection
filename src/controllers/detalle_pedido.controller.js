import { Detalle_Pedido } from '../models/Detalle_Pedido.model.js';
import { Pedido } from '../models/Pedido.model.js';
import { Producto } from '../models/producto.model.js';

class DetallePedidoController {
    // Obtener todos los detalles de pedidos
    static async getDetallesPedidos(req, res) {
        try {
            const detallesPedidos = await Detalle_Pedido.findAll();
            res.status(200).json(detallesPedidos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los detalles de pedidos: ' + error });
        }
    }

    // Obtener un detalle de pedido por ID
    static async getDetallePedido(req, res) {
        try {
            const id = req.params.id;
            const detallePedido = await Detalle_Pedido.findByPk(id);
            if (detallePedido) {
                res.status(200).json(detallePedido);
            } else {
                res.status(404).json({ message: 'Detalle de pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el detalle de pedido: ' + error });
        }
    }

    // Crear un nuevo detalle de pedido
    static async postDetallePedido(req, res) {
        try {
            const { cantidad, precio_unitario, pedido_id, producto_id } = req.body;

            // Validar existencia de pedido y producto
            const pedido = await Pedido.findByPk(pedido_id);
            const producto = await Producto.findByPk(producto_id);

            if (!pedido) {
                return res.status(400).json({ message: 'Pedido no encontrado' });
            }
            if (!producto) {
                return res.status(400).json({ message: 'Producto no encontrado' });
            }

            await Detalle_Pedido.create({
                cantidad,
                precio_unitario,
                pedido_id,
                producto_id
            });
            res.status(201).json({ message: 'Detalle de pedido creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el detalle de pedido: ' + error });
        }
    }

    // Actualizar un detalle de pedido
    static async putDetallePedido(req, res) {
        try {
            const id = req.params.id;
            const { cantidad, precio_unitario, pedido_id, producto_id } = req.body;

            // Validar existencia de pedido y producto
            const pedido = await Pedido.findByPk(pedido_id);
            const producto = await Producto.findByPk(producto_id);

            if (!pedido) {
                return res.status(400).json({ message: 'Pedido no encontrado' });
            }
            if (!producto) {
                return res.status(400).json({ message: 'Producto no encontrado' });
            }

            const [updated] = await Detalle_Pedido.update({
                cantidad,
                precio_unitario,
                pedido_id,
                producto_id
            }, {
                where: { id_detalle_pedido: id }
            });

            if (updated) {
                res.status(200).json({ message: 'Detalle de pedido actualizado correctamente' });
            } else {
                res.status(404).json({ message: 'Detalle de pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el detalle de pedido: ' + error });
        }
    }

    // Eliminar un detalle de pedido
    static async deleteDetallePedido(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Detalle_Pedido.destroy({ where: { id_detalle_pedido: id } });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Detalle de pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el detalle de pedido: ' + error });
        }
    }
}

export default DetallePedidoController;
