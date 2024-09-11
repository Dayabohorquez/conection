import { DataTypes } from 'sequelize';
import { sequelize } from "../config/db";
import Pedido from '../models/Pedido.js';
import Usuario from '../models/Usuario.js';

const AsignacionPedido = sequelize.define('AsignacionPedido', {
    id_asignacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    pedido_asignado: {
        type: DataTypes.ENUM('Vendedor', 'Domiciliario'),
        allowNull: false,
    },
    estado_asignacion: {
        type: DataTypes.ENUM('Asignado', 'En camino', 'Entregado', 'Pendiente'),
        defaultValue: 'Pendiente',
    },
    fecha_asignacion: {
        type: DataTypes.DATE,
    },
});

AsignacionPedido.belongsTo(Usuario, { foreignKey: 'documento' });
AsignacionPedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

export default AsignacionPedido;