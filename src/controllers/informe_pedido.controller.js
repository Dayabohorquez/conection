import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class InformePedidosController {
  // Obtener todos los informes
static async getInformes(req, res) {
    try {
        const informes = await sequelize.query('CALL GetInformes()', { type: QueryTypes.RAW });
        res.json(informes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los informes', error });
    }
}

// Obtener un informe por ID
static async getInforme(req, res) {
    const { id } = req.params;
    try {
        const result = await sequelize.query('CALL GetInformeById(:id)', {
            replacements: { id },
            type: QueryTypes.RAW
        });
        const informe = result[0];
        if (informe) {
            res.json(informe);
        } else {
            res.status(404).json({ message: 'Informe no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el informe', error });
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

            await sequelize.query('CALL CreateInforme(:fecha_generacion, :tipo_informe, :datos_analisis)', {
                replacements: { fecha_generacion, tipo_informe, datos_analisis },
                type: QueryTypes.RAW
            });
            res.status(201).json({ message: 'Informe creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el informe: ' + error.message });
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

            const result = await sequelize.query('CALL GetInformeById(:informe_id)', {
                replacements: { informe_id: id },
                type: QueryTypes.SELECT
            });
            const informe = result[0];

            if (!informe) {
                return res.status(404).json({ message: 'Informe no encontrado' });
            }

            await sequelize.query('CALL UpdateInforme(:informe_id, :fecha_generacion, :tipo_informe, :datos_analisis)', {
                replacements: { informe_id: id, fecha_generacion, tipo_informe, datos_analisis },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Informe actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el informe: ' + error.message });
        }
    }
}

export default InformePedidosController;
