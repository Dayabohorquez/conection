import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Producto = sequelize.define('Producto', {
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_producto: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    descripcion_producto: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    precio_producto: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    estado_producto: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    tipo_producto: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'Producto',
    timestamps: false
});
