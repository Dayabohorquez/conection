import { Pago } from '../models/Pago.model.js';

class PagoController {
    // Obtener todos los pagos
    static async getPagos(req, res) {
        try {
            const pagos = await Pago.findAll();
            res.status(200).json(pagos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los pagos: ' + error });
        }
    }

    // Obtener un pago por ID
    static async getPago(req, res) {
        try {
            const id = req.params.id;
            const pago = await Pago.findByPk(id);
            if (pago) {
                res.status(200).json(pago);
            } else {
                res.status(404).json({ message: 'Pago no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el pago: ' + error });
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

            await Pago.create({
                nombre_pago,
                fecha_pago,
                iva,
                metodo_pago,
                subtotal_pago,
                total_pago
            });
            res.status(201).json({ message: 'Pago creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el pago: ' + error });
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

            const [updated] = await Pago.update({
                nombre_pago,
                fecha_pago,
                iva,
                metodo_pago,
                subtotal_pago,
                total_pago
            }, {
                where: { id_pago: id }
            });

            if (updated) {
                res.status(200).json({ message: 'Pago actualizado correctamente' });
            } else {
                res.status(404).json({ message: 'Pago no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el pago: ' + error });
        }
    }

    // Eliminar un pago
    static async deletePago(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Pago.destroy({
                where: { id_pago: id }
            });

            if (deleted) {
                res.status(204).send(); // 204 No Content
            } else {
                res.status(404).json({ message: 'Pago no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el pago: ' + error });
        }
    }
}

export default PagoController;
