import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Usuario } from "./Usuario.model.js";
import { Pago } from "./Pago.model.js";

export const Pedido = sequelize.define('Pedido', {
    id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_pedido: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado_pedido: {
        type: DataTypes.ENUM('Pendiente', 'Enviado', 'Entregado', 'Cancelado'),
        allowNull: false
    },
    total_pagado: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    },
    pago_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pago,
            key: 'id_pago'
        }
    }
}, {
    tableName: 'Pedido',
    timestamps: false
});

Usuario.hasMany(Pedido, { foreignKey: 'usuario_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Pago.hasMany(Pedido, { foreignKey: 'pago_id' });
Pedido.belongsTo(Pago, { foreignKey: 'pago_id' });
