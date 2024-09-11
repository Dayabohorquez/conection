import { DataTypes } from 'sequelize';
import { sequelize } from "../config/db";

const FechaEspecial = sequelize.define('FechaEspecial', {
    id_fecha_especial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    nombre_fecha_especial: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    foto_fecha_especial: {
        type: DataTypes.TEXT,
    },
    foto_fecha_especialURL: {
        type: DataTypes.TEXT,
    },
});

export default FechaEspecial;