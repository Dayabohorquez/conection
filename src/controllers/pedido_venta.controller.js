import { Pedido_Venta } from "../models/pedido_Venta.model.js";

// Obtener todas las relaciones de Pedido_Venta
export const getPedidoVentas = async (req, res) => {
    try {
        const pedidosVentas = await Pedido_Venta.findAll();
        res.status(200).json(pedidosVentas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los registros de Pedido_Venta: ' + error });
    }
};

// Obtener una relación de Pedido_Venta por ID
export const getPedidoVenta = async (req, res) => {
    try {
        const id = req.params.id;
        const pedidoVenta = await Pedido_Venta.findByPk(id);
        if (pedidoVenta) {
            res.status(200).json(pedidoVenta);
        } else {
            res.status(404).json({ message: 'Registro de Pedido_Venta no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el registro de Pedido_Venta: ' + error });
    }
};

// Crear una nueva relación de Pedido_Venta
export const postPedidoVenta = async (req, res) => {
    try {
        const { informe_id, historial_id } = req.body;
        await Pedido_Venta.create({
            informe_id,
            historial_id
        });
        res.status(201).json({ message: 'Registro de Pedido_Venta creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el registro de Pedido_Venta: ' + error });
    }
};

// Actualizar una relación de Pedido_Venta
export const putPedidoVenta = async (req, res) => {
    try {
        const id = req.params.id;
        const { informe_id, historial_id } = req.body;

        const [updated] = await Pedido_Venta.update({
            informe_id,
            historial_id
        }, {
            where: { id_pedido_venta: id }
        });

        if (updated) {
            res.status(200).json({ message: 'Registro de Pedido_Venta actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'Registro de Pedido_Venta no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el registro de Pedido_Venta: ' + error });
    }
};

// Eliminar una relación de Pedido_Venta
export const deletePedidoVenta = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Pedido_Venta.destroy({ where: { id_pedido_venta: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Registro de Pedido_Venta no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el registro de Pedido_Venta: ' + error });
    }
};
