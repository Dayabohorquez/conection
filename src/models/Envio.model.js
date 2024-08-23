import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import { Pedido } from "./Pedido.model.js";

class Envio extends Model {
    // Método para crear un nuevo envío
    static async createEnvio(envio) {
        try {
            return await this.create(envio);
        } catch (error) {
            console.error(`Unable to create Envio: ${error}`);
            throw error;
        }
    }

    // Método para obtener todos los envíos
    static async getEnvios() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all Envios: ${error}`);
            throw error;
        }
    }

    // Método para obtener un envío por ID
    static async getEnvioById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find Envio by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar un envío
    static async updateEnvio(id, updatedEnvio) {
        try {
            const envio = await this.findByPk(id);
            if (envio) {
                return await envio.update(updatedEnvio);
            }
            throw new Error('Envío no encontrado');
        } catch (error) {
            console.error(`Unable to update Envio: ${error}`);
            throw error;
        }
    }
}

// Definición del modelo Envio en Sequelize
Envio.init({
    id_envio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_envio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado_envio: {
        type: DataTypes.ENUM('Preparando', 'En camino', 'Entregado', 'Retrasado'),
        allowNull: false
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pedido,
            key: 'id_pedido'
        }
    }
}, {
    sequelize,
    tableName: 'Envio',
    timestamps: false,
    underscored: false,
});

// Relaciones
Pedido.hasMany(Envio, { foreignKey: 'pedido_id' });
Envio.belongsTo(Pedido, { foreignKey: 'pedido_id' });

export { Envio };
