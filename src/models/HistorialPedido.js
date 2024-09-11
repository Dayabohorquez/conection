import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Pedido from '../models/Pedido.js';

const HistorialPedido = sequelize.define('HistorialPedido', {
    id_historial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    estado_pedido: {
        type: DataTypes.ENUM('Pendiente', 'Enviado', 'Entregado', 'Cancelado'),
        allowNull: false,
    },
    fecha_cambio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

HistorialPedido.belongsTo(Pedido, { foreignKey: 'id_pedido' });

export default HistorialPedido;