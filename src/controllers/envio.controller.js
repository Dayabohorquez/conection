import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class EnvioController {
// Obtener todos los envíos
static async getEnvios(req, res) {
    try {
        const envios = await sequelize.query('CALL GetAllEnvios()', { type: QueryTypes.RAW });
        res.json(envios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los envíos', error });
    }
}

// Obtener un envío por ID
static async getEnvio(req, res) {
    const { id } = req.params;
    try {
        const result = await sequelize.query('CALL GetEnvioById(:id)', {
            replacements: { id },
            type: QueryTypes.RAW
        });
        const envio = result[0];
        if (envio) {
            res.json(envio);
        } else {
            res.status(404).json({ message: 'Envío no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el envío', error });
    }
}

// Obtener todos los detalles de pedidos
static async getDetallesPedidos(req, res) {
    try {
        const detallesPedidos = await sequelize.query('CALL GetAllDetallesPedidos()', { type: QueryTypes.RAW });
        res.json(detallesPedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los detalles de pedidos', error });
    }
}

    // Crear un nuevo envío
    static async postEnvio(req, res) {
        try {
            const { fecha_envio, estado_envio, pedido_id } = req.body;

            // Validar el estado del envío
            const estadosEnvioPermitidos = ['Preparando', 'En camino', 'Entregado', 'Retrasado'];
            if (!estadosEnvioPermitidos.includes(estado_envio)) {
                return res.status(400).json({ message: 'Estado de envío no válido' });
            }

            await sequelize.query('CALL CreateEnvio(:fecha_envio, :estado_envio, :pedido_id)', {
                replacements: { fecha_envio, estado_envio, pedido_id },
                type: QueryTypes.RAW
            });
            res.status(201).json({ message: 'Envío creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el envío: ' + error.message });
        }
    }

    // Actualizar un envío
    static async putEnvio(req, res) {
        try {
            const id = req.params.id;
            const { fecha_envio, estado_envio, pedido_id } = req.body;

            // Validar el estado del envío
            const estadosEnvioPermitidos = ['Preparando', 'En camino', 'Entregado', 'Retrasado'];
            if (!estadosEnvioPermitidos.includes(estado_envio)) {
                return res.status(400).json({ message: 'Estado de envío no válido' });
            }

            const result = await sequelize.query('CALL GetEnvioById(:envio_id)', {
                replacements: { envio_id: id },
                type: QueryTypes.SELECT
            });
            const envio = result[0];

            if (!envio) {
                return res.status(404).json({ message: 'Envío no encontrado' });
            }

            await sequelize.query('CALL UpdateEnvio(:p_id_envio, :p_fecha_envio, :p_estado_envio, :p_pedido_id)', {
                replacements: { p_id_envio: id, p_fecha_envio: fecha_envio, p_estado_envio: estado_envio, p_pedido_id: pedido_id },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Envío actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el envío: ' + error.message });
        }
    }

    // Eliminar un envío
    static async deleteEnvio(req, res) {
        try {
            const id = req.params.id;
            const result = await sequelize.query('CALL DeleteEnvio(:envio_id)', {
                replacements: { envio_id: id },
                type: QueryTypes.RAW
            });

            if (result[1] > 0) { 
                res.status(204).send(); 
                res.status(404).json({ message: 'Envío no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el envío: ' + error.message });
        }
    }
}

export default EnvioController;
