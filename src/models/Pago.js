import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const Pago = sequelize.define('Pago', {
    id_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    nombre_pago: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    iva: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    metodo_pago: {
        type: DataTypes.ENUM('Nequi', 'Bancolombia', 'Efectivo'),
        allowNull: false,
    },
    subtotal_pago: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total_pago: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    estado_pago: {
        type: DataTypes.ENUM('Exitoso', 'Pendiente', 'Fallido', 'Cancelado'),
        defaultValue: 'Pendiente',
    },
});

export default Pago;