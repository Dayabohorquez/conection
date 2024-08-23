import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Pago extends Model {
    // Método para crear un nuevo pago
    static async createPago(pago) {
        try {
            return await this.create(pago);
        } catch (error) {
            console.error(`Unable to create Pago: ${error}`);
            throw error;
        }
    }

    // Método para obtener todos los pagos
    static async getPagos() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all Pagos: ${error}`);
            throw error;
        }
    }

    // Método para obtener un pago por ID
    static async getPagoById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find Pago by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar un pago
    static async updatePago(id, updatedPago) {
        try {
            const pago = await this.findByPk(id);
            return pago.update(updatedPago);
        } catch (error) {
            console.error(`Unable to update Pago: ${error}`);
            throw error;
        }
    }
}

// Definición del modelo Pago en Sequelize
Pago.init({
    id_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_pago: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: false
    },
    iva: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    metodo_pago: {
        type: DataTypes.ENUM('Tarjeta de credito', 'Transferencia bancaria', 'PayPal', 'Otro'),
        allowNull: false
    },
    subtotal_pago: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    total_pago: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'Pago',
    timestamps: false,
    underscored: false,
});

export { Pago };
