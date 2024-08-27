import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class Pedido_VentaController {
    // Obtener todos los registros de Pedido_Venta
static async getPedidoVentas(req, res) {
    try {
        const pedidoVentas = await sequelize.query('CALL GetPedidoVentas()', { type: QueryTypes.RAW });
        res.json(pedidoVentas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los registros de Pedido_Venta', error });
    }
}

// Obtener un registro de Pedido_Venta por ID
static async getPedidoVenta(req, res) {
    const { id } = req.params;
    try {
        const result = await sequelize.query('CALL GetPedidoVentaById(:id)', {
            replacements: { id },
            type: QueryTypes.RAW
        });
        const pedidoVenta = result[0];
        if (pedidoVenta) {
            res.json(pedidoVenta);
        } else {
            res.status(404).json({ message: 'Registro de Pedido_Venta no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el registro de Pedido_Venta', error });
    }
}

    // Crear una nueva relación de Pedido_Venta
    static async postPedidoVenta(req, res) {
        try {
            const { informe_id, historial_id } = req.body;
            await sequelize.query('CALL CreatePedidoVenta(:informe_id, :historial_id)', {
                replacements: { informe_id, historial_id },
                type: QueryTypes.RAW // Usar QueryTypes.RAW para operaciones sin datos de retorno
            });
            res.status(201).json({ message: 'Registro de Pedido_Venta creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el registro de Pedido_Venta: ' + error.message });
        }
    }

    // Actualizar una relación de Pedido_Venta
    static async putPedidoVenta(req, res) {
        try {
            const id = req.params.id;
            const { informe_id, historial_id } = req.body;

            const result = await sequelize.query('CALL GetPedidoVentaById(:pedido_venta_id)', {
                replacements: { pedido_venta_id: id },
                type: QueryTypes.SELECT
            });
            const pedidoVenta = result[0];

            if (!pedidoVenta) {
                return res.status(404).json({ message: 'Registro de Pedido_Venta no encontrado' });
            }

            await sequelize.query('CALL UpdatePedidoVenta(:pedido_venta_id, :informe_id, :historial_id)', {
                replacements: { pedido_venta_id: id, informe_id, historial_id },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Registro de Pedido_Venta actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el registro de Pedido_Venta: ' + error.message });
        }
    }
}

export default Pedido_VentaController;
