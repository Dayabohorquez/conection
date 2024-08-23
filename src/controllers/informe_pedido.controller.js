import { Informe_Pedidos } from '../models/Informe_Pedidos.model.js';

class InformePedidosController {
    // Obtener todos los informes
    static async getInformes(req, res) {
        try {
            const informes = await Informe_Pedidos.findAll();
            res.status(200).json(informes);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los informes: ' + error });
        }
    }

    // Obtener un informe por ID
    static async getInforme(req, res) {
        try {
            const id = req.params.id;
            const informe = await Informe_Pedidos.findByPk(id);
            if (informe) {
                res.status(200).json(informe);
            } else {
                res.status(404).json({ message: 'Informe no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el informe: ' + error });
        }
    }

    // Crear un nuevo informe
    static async postInforme(req, res) {
        try {
            const { fecha_generacion, tipo_informe, datos_analisis } = req.body;

            // Validar el tipo de informe
            const tiposInformePermitidos = ['Informe Diario', 'Informe Semanal', 'Informe Quincenal', 'Informe Mensual'];
            if (!tiposInformePermitidos.includes(tipo_informe)) {
                return res.status(400).json({ message: 'Tipo de informe no válido' });
            }

            await Informe_Pedidos.create({
                fecha_generacion,
                tipo_informe,
                datos_analisis
            });
            res.status(201).json({ message: 'Informe creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el informe: ' + error });
        }
    }

    // Actualizar un informe
    static async putInforme(req, res) {
        try {
            const id = req.params.id;
            const { fecha_generacion, tipo_informe, datos_analisis } = req.body;

            // Validar el tipo de informe
            const tiposInformePermitidos = ['Informe Diario', 'Informe Semanal', 'Informe Quincenal', 'Informe Mensual'];
            if (!tiposInformePermitidos.includes(tipo_informe)) {
                return res.status(400).json({ message: 'Tipo de informe no válido' });
            }

            const [updated] = await Informe_Pedidos.update({
                fecha_generacion,
                tipo_informe,
                datos_analisis
            }, {
                where: { id_informe: id }
            });

            if (updated) {
                res.status(200).json({ message: 'Informe actualizado correctamente' });
            } else {
                res.status(404).json({ message: 'Informe no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el informe: ' + error });
        }
    }

    /*// Eliminar un informe
    static async deleteInforme(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Informe_Pedidos.destroy({
                where: { id_informe: id }
            });

            if (deleted) {
                res.status(204).send(); // 204 No Content
            } else {
                res.status(404).json({ message: 'Informe no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el informe: ' + error });
        }
    }*/
}

export default InformePedidosController;
