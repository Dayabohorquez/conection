import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class PagoController {
    // Obtener todos los pagos
static async getPagos(req, res) {
    try {
        const pagos = await sequelize.query('CALL GetPagos()', { type: QueryTypes.RAW });
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos', error });
    }
}

// Obtener un pago por ID
static async getPago(req, res) {
    const { id } = req.params;
    try {
        const result = await sequelize.query('CALL GetPagoById(:id)', {
            replacements: { id },
            type: QueryTypes.RAW
        });
        const pago = result[0];
        if (pago) {
            res.json(pago);
        } else {
            res.status(404).json({ message: 'Pago no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pago', error });
    }
}

    // Crear un nuevo pago
    static async postPago(req, res) {
        try {
            const { nombre_pago, fecha_pago, iva, metodo_pago, subtotal_pago, total_pago } = req.body;

            // Validar el método de pago
            const metodosPagoPermitidos = ['Tarjeta de credito', 'Transferencia bancaria', 'PayPal', 'Otro'];
            if (!metodosPagoPermitidos.includes(metodo_pago)) {
                return res.status(400).json({ message: 'Método de pago no válido' });
            }

            await sequelize.query('CALL CreatePago(:nombre_pago, :fecha_pago, :iva, :metodo_pago, :subtotal_pago, :total_pago)', {
                replacements: { nombre_pago, fecha_pago, iva, metodo_pago, subtotal_pago, total_pago },
                type: QueryTypes.RAW
            });
            res.status(201).json({ message: 'Pago creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el pago: ' + error.message });
        }
    }

    // Actualizar un pago
    static async putPago(req, res) {
        try {
            const id = req.params.id;
            const { nombre_pago, fecha_pago, iva, metodo_pago, subtotal_pago, total_pago } = req.body;

            // Validar el método de pago
            const metodosPagoPermitidos = ['Tarjeta de credito', 'Transferencia bancaria', 'PayPal', 'Otro'];
            if (!metodosPagoPermitidos.includes(metodo_pago) || metodo_pago.trim() === '') {
                return res.status(400).json({ message: 'Método de pago no válido o vacío' });
            }

            const result = await sequelize.query('CALL GetPagoById(:pago_id)', {
                replacements: { pago_id: id },
                type: QueryTypes.SELECT
            });
            const pago = result[0];

            if (!pago) {
                return res.status(404).json({ message: 'Pago no encontrado' });
            }

            await sequelize.query('CALL UpdatePago(:pago_id, :nombre_pago, :fecha_pago, :iva, :metodo_pago, :subtotal_pago, :total_pago)', {
                replacements: { pago_id: id, nombre_pago, fecha_pago, iva, metodo_pago, subtotal_pago, total_pago },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Pago actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el pago: ' + error.message });
        }
    }

    // Eliminar un pago
    static async deletePago(req, res) {
        try {
            const id = req.params.id;
            const result = await sequelize.query('CALL DeletePago(:pago_id)', {
                replacements: { pago_id: id },
                type: QueryTypes.RAW
            });
                console.log('Resultado de la consulta:', result);
                if (Array.isArray(result) && result.length > 0) {
                const [data] = result;
                    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && 'affectedRows' in data[0]) {
                    if (data[0].affectedRows > 0) {
                        res.status(204).send();
                    } else {
                        res.status(404).json({ message: 'Pago no encontrado' });
                    }
                } else {
                    res.status(500).json({ message: 'Formato de resultado inesperado' });
                }
            } else {
                res.status(500).json({ message: 'Formato de resultado inesperado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el pago: ' + error.message });
        }
    }
}

export default PagoController;
