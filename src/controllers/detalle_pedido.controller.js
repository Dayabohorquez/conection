import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js'; 

class DetallePedidoController {
   // Obtener todos los detalles de pedidos
static async getDetallesPedidos(req, res) {
    try {
        const detallesPedidos = await sequelize.query('CALL GetAllDetallesPedidos()', { type: QueryTypes.RAW });
        res.json(detallesPedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los detalles de pedidos', error });
    }
}

// Obtener un detalle de pedido por ID
static async getDetallePedido(req, res) {
    const { id } = req.params;
    try {
        const result = await sequelize.query('CALL GetDetallePedidoById(:id)', {
            replacements: { id },
            type: QueryTypes.RAW
        });
        const detallePedido = result[0];
        if (detallePedido) {
            res.json(detallePedido);
        } else {
            res.status(404).json({ message: 'Detalle de pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el detalle de pedido', error });
    }
}

    // Crear un nuevo detalle de pedido
    static async postDetallePedido(req, res) {
        try {
            const { cantidad, precio_unitario, pedido_id, producto_id } = req.body;
            await sequelize.query('CALL CreateDetallePedido(:cantidad, :precio_unitario, :pedido_id, :producto_id)', {
                replacements: { cantidad, precio_unitario, pedido_id, producto_id },
                type: QueryTypes.RAW
            });
            res.status(201).json({ message: 'Detalle de pedido creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el detalle de pedido: ' + error });
        }
    }

    // Actualizar un detalle de pedido
    static async putDetallePedido(req, res) {
        try {
            const { id } = req.params;
            const { cantidad, precio_unitario, pedido_id, producto_id } = req.body;
            const [result] = await sequelize.query('CALL UpdateDetallePedido(:id, :cantidad, :precio_unitario, :pedido_id, :producto_id)', {
                replacements: { id, cantidad, precio_unitario, pedido_id, producto_id },
                type: QueryTypes.RAW
            });

            if (result[1].affectedRows > 0) { 
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
            const { id } = req.params;
            const [result] = await sequelize.query('CALL DeleteDetallePedido(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });

            if (result[1].affectedRows > 0) { 
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
