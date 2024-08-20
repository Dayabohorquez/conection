import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Informe_Pedidos } from "./Informe_Pedidos.model.js";
import { Historial_Pedidos } from "./historial_Pedidos.model.js";

export const Pedido_Venta = sequelize.define('Pedido_Venta', {
    id_pedido_venta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    informe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Informe_Pedidos,
            key: 'id_informe'
        }
    },
    historial_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Historial_Pedidos,
            key: 'id_historial'
        }
    }
}, {
    tableName: 'Pedido_Venta',
    timestamps: false
});

Informe_Pedidos.hasMany(Pedido_Venta, { foreignKey: 'informe_id' });
Pedido_Venta.belongsTo(Informe_Pedidos, { foreignKey: 'informe_id' });

Historial_Pedidos.hasMany(Pedido_Venta, { foreignKey: 'historial_id' });
Pedido_Venta.belongsTo(Historial_Pedidos, { foreignKey: 'historial_id' });
