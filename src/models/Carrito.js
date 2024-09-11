import { DataTypes } from 'sequelize';
import { sequelize } from "../config/db";
import Producto from '../models/Producto.js';
import Usuario from '../models/Usuario.js';

const Carrito = sequelize.define('Carrito', {
    id_carrito: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    documento: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha_agregado: {
        type: DataTypes.DATE,
    },
});

Carrito.belongsTo(Usuario, { foreignKey: 'documento' });
Carrito.belongsTo(Producto, { foreignKey: 'id_producto' });

export default Carrito;