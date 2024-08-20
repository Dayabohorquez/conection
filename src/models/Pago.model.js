import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Pago = sequelize.define('Pago', {
    id_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_pago: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: false
    },
    iva: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    metodo_pago: {
        type: DataTypes.ENUM('Tarjeta de credito', 'Transferencia bancaria', 'PayPal', 'Otro'),
        allowNull: false
    },
    subtotal_pago: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    total_pago: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    }
}, {
    tableName: 'Pago',
    timestamps: false
});
