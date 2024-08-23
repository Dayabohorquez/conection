import { Pedido } from '../models/Pedido.model.js';

class PedidoController {
    // Obtener todos los pedidos
    static async getPedidos(req, res) {
        try {
            const pedidos = await Pedido.getPedidos();
            res.status(200).json(pedidos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los pedidos: ' + error });
        }
    }

    // Obtener un pedido por ID
    static async getPedido(req, res) {
        try {
            const id = req.params.id;
            const pedido = await Pedido.getPedidoById(id);
            if (pedido) {
                res.status(200).json(pedido);
            } else {
                res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el pedido: ' + error });
        }
    }

    // Crear un nuevo pedido
    static async postPedido(req, res) {
        try {
            const { fecha_pedido, estado_pedido, total_pagado, usuario_id, pago_id } = req.body;

            // Validar estado del pedido
            const estadosPermitidos = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
            if (!estadosPermitidos.includes(estado_pedido)) {
                return res.status(400).json({ message: 'Estado de pedido no válido' });
            }

            await Pedido.createPedido({
                fecha_pedido,
                estado_pedido,
                total_pagado,
                usuario_id,
                pago_id
            });
            res.status(201).json({ message: 'Pedido creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el pedido: ' + error });
        }
    }

    // Actualizar un pedido
    static async putPedido(req, res) {
        try {
            const id = req.params.id;
            const { fecha_pedido, estado_pedido, total_pagado, usuario_id, pago_id } = req.body;

            // Validar estado del pedido
            const estadosPermitidos = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
            if (!estadosPermitidos.includes(estado_pedido)) {
                return res.status(400).json({ message: 'Estado de pedido no válido' });
            }

            const pedido = await Pedido.getPedidoById(id);

            if (!pedido) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }

            await Pedido.updatePedido(id, {
                fecha_pedido,
                estado_pedido,
                total_pagado,
                usuario_id,
                pago_id
            });
            res.status(200).json({ message: 'Pedido actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el pedido: ' + error });
        }
    }

    /*// Eliminar un pedido
    static async deletePedido(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Pedido.destroy({
                where: { id_pedido: id }
            });

            if (deleted) {
                res.status(204).send(); // 204 No Content, indica que la eliminación fue exitosa y no hay contenido que devolver
            } else {
                res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el pedido: ' + error });
        }
    }*/
}

export default PedidoController;
