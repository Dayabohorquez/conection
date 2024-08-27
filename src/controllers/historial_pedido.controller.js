import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class HistorialPedidosController {
    // Obtener todos los historiales de pedidos
static async getHistorials(req, res) {
    try {
        const historials = await sequelize.query('CALL GetAllHistorials()', { type: QueryTypes.RAW });
        res.json(historials);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los historiales de pedidos', error });
    }
}

// Obtener un historial de pedido por ID
static async getHistorial(req, res) {
    const { id } = req.params;
    try {
        const result = await sequelize.query('CALL GetHistorialById(:id)', {
            replacements: { id },
            type: QueryTypes.RAW
        });
        const historial = result[0];
        if (historial) {
            res.json(historial);
        } else {
            res.status(404).json({ message: 'Historial de pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el historial de pedido', error });
    }
}

    // Crear un nuevo historial de pedido
    static async postHistorial(req, res) {
        try {
            const { fecha_consulta, detalles_pedido, usuario_id } = req.body;

            // Validar detalles_pedido
            if (!detalles_pedido || detalles_pedido.length < 1 || detalles_pedido.length > 50) {
                return res.status(400).json({ message: 'Detalles del pedido no válidos' });
            }

            await sequelize.query('CALL CreateHistorial(:fecha_consulta, :detalles_pedido, :usuario_id)', {
                replacements: { fecha_consulta, detalles_pedido, usuario_id },
                type: QueryTypes.RAW 
            });
            res.status(201).json({ message: 'Historial de pedido creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el historial de pedido: ' + error.message });
        }
    }

    // Actualizar un historial de pedido
    static async putHistorial(req, res) {
        try {
            const id = req.params.id;
            const { fecha_consulta, detalles_pedido, usuario_id } = req.body;

            // Validar detalles_pedido
            if (!detalles_pedido || detalles_pedido.length < 1 || detalles_pedido.length > 50) {
                return res.status(400).json({ message: 'Detalles del pedido no válidos' });
            }

            const result = await sequelize.query('CALL GetHistorialById(:historial_id)', {
                replacements: { historial_id: id },
                type: QueryTypes.SELECT
            });
            const historial = result[0];

            if (!historial) {
                return res.status(404).json({ message: 'Historial de pedido no encontrado' });
            }

            await sequelize.query('CALL UpdateHistorial(:p_id_historial, :p_fecha_consulta, :p_detalles_pedido, :p_usuario_id)', {
                replacements: { p_id_historial: id, p_fecha_consulta: fecha_consulta, p_detalles_pedido: detalles_pedido, p_usuario_id: usuario_id },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Historial de pedido actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el historial de pedido: ' + error.message });
        }
    }

    // Eliminar un historial de pedido
    static async deleteHistorial(req, res) {
        try {
            const id = req.params.id;
            const result = await sequelize.query('CALL DeleteHistorial(:historial_id)', {
                replacements: { historial_id: id },
                type: QueryTypes.RAW
            });

            if (result[1] > 0) { 
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Historial de pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el historial de pedido: ' + error.message });
        }
    }
}

export default HistorialPedidosController;
