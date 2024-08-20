import { Informe_Pedidos } from "../models/Informe_Pedidos.model.js";

// Valores permitidos para el tipo de informe
const tiposInformePermitidos = ['Informe Diario', 'Informe Semanal', 'Informe Quincenal', 'Informe Mensual'];

// Obtener todos los informes
export const getInformes = async (req, res) => {
    try {
        const informes = await Informe_Pedidos.findAll();
        res.status(200).json(informes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los informes: ' + error });
    }
};

// Obtener un informe por ID
export const getInforme = async (req, res) => {
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
};

// Crear un nuevo informe
export const postInforme = async (req, res) => {
    try {
        const { fecha_generacion, tipo_informe, datos_analisis } = req.body;

        // Validar el tipo de informe
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
};

// Actualizar un informe
export const putInforme = async (req, res) => {
    try {
        const id = req.params.id;
        const { fecha_generacion, tipo_informe, datos_analisis } = req.body;

        // Validar el tipo de informe
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
};

/*
// Eliminar un informe
export const deleteInforme = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Informe_Pedidos.destroy({ where: { id_informe: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Informe no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el informe: ' + error });
    }
};*/