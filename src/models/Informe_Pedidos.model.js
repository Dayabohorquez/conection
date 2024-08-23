import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Informe_Pedidos extends Model {
    // Método para crear un nuevo informe
    static async createInforme(informe) {
        try {
            return await this.create(informe);
        } catch (error) {
            console.error(`Unable to create Informe_Pedidos: ${error}`);
            throw error;
        }
    }

    // Método para obtener todos los informes
    static async getInformes() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all Informes_Pedidos: ${error}`);
            throw error;
        }
    }

    // Método para obtener un informe por ID
    static async getInformeById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find Informe_Pedidos by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar un informe
    static async updateInforme(id, updatedInforme) {
        try {
            const informe = await this.findByPk(id);
            return informe.update(updatedInforme);
        } catch (error) {
            console.error(`Unable to update Informe_Pedidos: ${error}`);
            throw error;
        }
    }
}

// Definición del modelo Informe_Pedidos en Sequelize
Informe_Pedidos.init({
    id_informe: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_generacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tipo_informe: {
        type: DataTypes.ENUM('Informe Diario', 'Informe Semanal', 'Informe Quincenal', 'Informe Mensual'),
        allowNull: false
    },
    datos_analisis: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'Informe_Pedidos',
    timestamps: false,
    underscored: false,
});

export { Informe_Pedidos };
