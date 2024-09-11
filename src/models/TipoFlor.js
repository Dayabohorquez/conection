import { DataTypes } from 'sequelize';
import { sequelize } from "../config/db";

const TipoFlor = sequelize.define('TipoFlor', {
    id_tipo_flor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    nombre_tipo_flor: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    foto_tipo_flor: {
        type: DataTypes.TEXT,
    },
    foto_tipo_florURL: {
        type: DataTypes.TEXT,
    },
});

export default TipoFlor;