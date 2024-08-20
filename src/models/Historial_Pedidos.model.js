import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Usuario } from "./Usuario.model.js";

export const Historial_Pedidos = sequelize.define('Historial_Pedidos', {
    id_historial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_consulta: {
        type: DataTypes.DATE,
        allowNull: false
    },
    detalles_pedido: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    }
}, {
    tableName: 'Historial_Pedidos',
    timestamps: false
});

Usuario.hasMany(Historial_Pedidos, { foreignKey: 'usuario_id' });
Historial_Pedidos.belongsTo(Usuario, { foreignKey: 'usuario_id' });
