import { DataTypes } from 'sequelize';
import { sequelize } from "../config/db";

const Evento = sequelize.define('Evento', {
    id_evento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    nombre_evento: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
});


export default Evento;