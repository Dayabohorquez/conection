import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class PedidoController {
    // Obtener todos los pedidos
static async getPedidos(req, res) {
    try {
        const pedidos = await sequelize.query('CALL GetPedidos()', { type: QueryTypes.RAW });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
}

// Obtener un pedido por ID
static async getPedido(req, res) {
    const { id } = req.params;
    try {
        const result = await sequelize.query('CALL GetPedidoById(:id)', {
            replacements: { id },
            type: QueryTypes.RAW
        });
        const pedido = result[0];
        if (pedido) {
            res.json(pedido);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pedido', error });
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

            await sequelize.query('CALL CreatePedido(:fecha_pedido, :estado_pedido, :total_pagado, :usuario_id, :pago_id)', {
                replacements: { fecha_pedido, estado_pedido, total_pagado, usuario_id, pago_id },
                type: QueryTypes.RAW
            });
            res.status(201).json({ message: 'Pedido creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el pedido: ' + error.message });
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

            const result = await sequelize.query('CALL GetPedidoById(:pedido_id)', {
                replacements: { pedido_id: id },
                type: QueryTypes.SELECT
            });
            const pedido = result[0];

            if (!pedido) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }

            await sequelize.query('CALL UpdatePedido(:pedido_id, :fecha_pedido, :estado_pedido, :total_pagado, :usuario_id, :pago_id)', {
                replacements: { pedido_id: id, fecha_pedido, estado_pedido, total_pagado, usuario_id, pago_id },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Pedido actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el pedido: ' + error.message });
        }
    }
}

export default PedidoController;
