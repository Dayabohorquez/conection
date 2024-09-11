import { DataTypes } from 'sequelize';
import { sequelize } from "../config/db";
import Carrito from '../models/Carrito.js';
import Pago from '../models/Pago.js';
import Usuario from '../models/Usuario.js';

const Pedido = sequelize.define('Pedido', {
    id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    fecha_pedido: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estado_pedido: {
        type: DataTypes.ENUM('Pendiente', 'Enviado', 'Entregado', 'Cancelado'),
        defaultValue: 'Pendiente',
    },
    total_pagado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    foto_Pedido: {
        type: DataTypes.TEXT,
    },
    foto_PedidoURL: {
        type: DataTypes.TEXT,
    },
});

Pedido.belongsTo(Usuario, { foreignKey: 'documento' });
Pedido.belongsTo(Pago, { foreignKey: 'pago_id' });
Pedido.belongsTo(Carrito, { foreignKey: 'id_carrito' });

export default Pedido;