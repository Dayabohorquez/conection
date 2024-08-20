import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Producto } from "./producto.model.js";
import { Pedido } from "./Pedido.model.js";

export const Detalle_Pedido = sequelize.define('Detalle_Pedido', {
    id_detalle_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_unitario: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pedido,
            key: 'id_pedido'
        }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id_producto'
        }
    }
}, {
    tableName: 'Detalle_Pedido',
    timestamps: false
});

Pedido.hasMany(Detalle_Pedido, { foreignKey: 'pedido_id' });
Detalle_Pedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

Producto.hasMany(Detalle_Pedido, { foreignKey: 'producto_id' });
Detalle_Pedido.belongsTo(Producto, { foreignKey: 'producto_id' });
