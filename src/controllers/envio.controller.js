import { Envio } from '../models/Envio.model.js';

class EnvioController {
    // Obtener todos los envíos
    static async getEnvios(req, res) {
        try {
            const envios = await Envio.findAll();
            res.status(200).json(envios);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los envíos: ' + error });
        }
    }

    // Obtener un envío por ID
    static async getEnvio(req, res) {
        try {
            const id = req.params.id;
            const envio = await Envio.findByPk(id);
            if (envio) {
                res.status(200).json(envio);
            } else {
                res.status(404).json({ message: 'Envío no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el envío: ' + error });
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

            await Envio.create({
                fecha_envio,
                estado_envio,
                pedido_id
            });
            res.status(201).json({ message: 'Envío creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el envío: ' + error });
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

            const [updated] = await Envio.update({
                fecha_envio,
                estado_envio,
                pedido_id
            }, {
                where: { id_envio: id }
            });

            if (updated) {
                res.status(200).json({ message: 'Envío actualizado correctamente' });
            } else {
                res.status(404).json({ message: 'Envío no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el envío: ' + error });
        }
    }

    // Eliminar un envío
    static async deleteEnvio(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Envio.destroy({ where: { id_envio: id } });
            if (deleted) {
                res.status(204).send(); // 204 No Content
            } else {
                res.status(404).json({ message: 'Envío no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el envío: ' + error });
        }
    }
}

export default EnvioController;
