import Evento from '../models/Evento.js';
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import TipoFlor from '../models/TipoFlor.js';

const Producto = sequelize.define('Producto', {
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    codigo_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombre_producto: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    foto_Producto: {
        type: DataTypes.TEXT,
    },
    foto_ProductoURL: {
        type: DataTypes.TEXT,
    },
    descripcion_producto: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    precio_producto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    estado_producto: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    cantidad_disponible: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});

Producto.belongsTo(TipoFlor, { foreignKey: 'id_tipo_flor' });
Producto.belongsTo(Evento, { foreignKey: 'id_evento' });

export default Producto;