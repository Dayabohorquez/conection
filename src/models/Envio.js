import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Pedido from '../models/Pedido.js';

const Envio = sequelize.define('Envio', {
    id_envio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    fecha_envio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estado_envio: {
        type: DataTypes.ENUM('Preparando', 'En camino', 'Entregado', 'Retrasado'),
        allowNull: false,
    },
});

Envio.belongsTo(Pedido, { foreignKey: 'pedido_id', onDelete: 'CASCADE' });

export default Envio;