import { DataTypes } from 'sequelize';
import { sequelize } from "../config/db";
import Pedido from '../models/Pedido.js';
import Producto from '../models/Producto.js';

const PedidoProducto = sequelize.define('PedidoProducto', {
    id_pedido_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
});

PedidoProducto.belongsTo(Pedido, { foreignKey: 'pedido_id' });
PedidoProducto.belongsTo(Producto, { foreignKey: 'producto_id' });

export default PedidoProducto;