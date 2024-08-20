import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_usuario: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    apellido_usuario: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    celular_usuario: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    correo_electronico_usuario: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    contrasena_usuario: {
        type: DataTypes.STRING(35),
        allowNull: false
    },
    rol_usuario: {
        type: DataTypes.ENUM('Cliente', 'Administrador', 'Vendedor', 'Domiciliario', 'Proveedor'),
        allowNull: false
    },
    estado_usuario: {
        type: DataTypes.CHAR,
        allowNull: false
    }
}, {
    tableName: 'Usuario',
    timestamps: false
});
