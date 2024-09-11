import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const Usuario = sequelize.define('Usuario', {
    tipo_documento: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    documento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    nombre_usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    apellido_usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    celular_usuario: {
        type: DataTypes.BIGINT(15),
        allowNull: false,
    },
    correo_electronico_usuario: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    usuario: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    contrasena_usuario: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING(255),
    },
    fecha_registro: {
        type: DataTypes.DATE,
    },
    rol_usuario: {
        type: DataTypes.ENUM('Cliente', 'Administrador', 'Vendedor', 'Domiciliario'),
        allowNull: false,
    },
    estado_usuario: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
})

export default Usuario;