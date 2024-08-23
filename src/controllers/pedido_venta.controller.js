import { Pedido_Venta } from '../models/Pedido_Venta.model.js';

class Pedido_VentaController {
    // Obtener todas las relaciones de Pedido_Venta
    static async getPedidoVentas(req, res) {
        try {
            const pedidosVentas = await Pedido_Venta.getPedidoVentas();
            res.status(200).json(pedidosVentas);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los registros de Pedido_Venta: ' + error });
        }
    }

    // Obtener una relación de Pedido_Venta por ID
    static async getPedidoVenta(req, res) {
        try {
            const id = req.params.id;
            const pedidoVenta = await Pedido_Venta.getPedidoVentaById(id);
            if (pedidoVenta) {
                res.status(200).json(pedidoVenta);
            } else {
                res.status(404).json({ message: 'Registro de Pedido_Venta no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el registro de Pedido_Venta: ' + error });
        }
    }

    // Crear una nueva relación de Pedido_Venta
    static async postPedidoVenta(req, res) {
        try {
            const { informe_id, historial_id } = req.body;
            await Pedido_Venta.createPedidoVenta({
                informe_id,
                historial_id
            });
            res.status(201).json({ message: 'Registro de Pedido_Venta creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el registro de Pedido_Venta: ' + error });
        }
    }

    // Actualizar una relación de Pedido_Venta
    static async putPedidoVenta(req, res) {
        try {
            const id = req.params.id;
            const { informe_id, historial_id } = req.body;

            const pedidoVenta = await Pedido_Venta.getPedidoVentaById(id);

            if (!pedidoVenta) {
                return res.status(404).json({ message: 'Registro de Pedido_Venta no encontrado' });
            }

            await Pedido_Venta.updatePedidoVenta(id, {
                informe_id,
                historial_id
            });
            res.status(200).json({ message: 'Registro de Pedido_Venta actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el registro de Pedido_Venta: ' + error });
        }
    }

    // Eliminar una relación de Pedido_Venta
    static async deletePedidoVenta(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Pedido_Venta.destroy({
                where: { id_pedido_venta: id }
            });

            if (deleted) {
                res.status(204).send(); // 204 No Content, indica que la eliminación fue exitosa y no hay contenido que devolver
            } else {
                res.status(404).json({ message: 'Registro de Pedido_Venta no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el registro de Pedido_Venta: ' + error });
        }
    }
}

export default Pedido_VentaController;
