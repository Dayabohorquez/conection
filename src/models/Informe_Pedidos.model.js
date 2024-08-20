import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Informe_Pedidos = sequelize.define('Informe_Pedidos', {
    id_informe: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_generacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tipo_informe: {
        type: DataTypes.ENUM('Informe Diario', 'Informe Semanal', 'Informe Quincenal', 'Informe Mensual'),
        allowNull: false
    },
    datos_analisis: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'Informe_Pedidos',
    timestamps: false
});
