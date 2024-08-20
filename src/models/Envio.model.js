import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Pedido } from "./Pedido.model.js";

export const Envio = sequelize.define('Envio', {
    id_envio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_envio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado_envio: {
        type: DataTypes.ENUM('Preparando', 'En camino', 'Entregado', 'Retrasado'),
        allowNull: false
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pedido,
            key: 'id_pedido'
        }
    }
}, {
    tableName: 'Envio',
    timestamps: false
});

Pedido.hasMany(Envio, { foreignKey: 'pedido_id' });
Envio.belongsTo(Pedido, { foreignKey: 'pedido_id' });
