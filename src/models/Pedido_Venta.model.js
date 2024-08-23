import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import { Informe_Pedidos } from "./Informe_Pedidos.model.js";
import { Historial_Pedidos } from "./Historial_Pedidos.model.js";

class Pedido_Venta extends Model {
    // Método para crear un nuevo registro de Pedido_Venta
    static async createPedidoVenta(pedidoVenta) {
        try {
            return await this.create(pedidoVenta);
        } catch (error) {
            console.error(`Unable to create Pedido_Venta: ${error}`);
            throw error;
        }
    }

    // Método para obtener todos los registros de Pedido_Venta
    static async getPedidoVentas() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all Pedido_Venta records: ${error}`);
            throw error;
        }
    }

    // Método para obtener un registro de Pedido_Venta por ID
    static async getPedidoVentaById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find Pedido_Venta by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar un registro de Pedido_Venta
    static async updatePedidoVenta(id, updated_pedidoVenta) {
        try {
            const pedidoVenta = await this.findByPk(id);
            return pedidoVenta.update(updated_pedidoVenta);
        } catch (error) {
            console.error(`Unable to update the Pedido_Venta: ${error}`);
            throw error;
        }
    }
}

// Definición del modelo Pedido_Venta en Sequelize
Pedido_Venta.init({
    id_pedido_venta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    informe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Informe_Pedidos,
            key: 'id_informe'
        }
    },
    historial_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Historial_Pedidos,
            key: 'id_historial'
        }
    }
}, {
    sequelize,
    tableName: 'Pedido_Venta',
    timestamps: false,
    underscored: false,
});

// Relaciones
Informe_Pedidos.hasMany(Pedido_Venta, { foreignKey: 'informe_id' });
Pedido_Venta.belongsTo(Informe_Pedidos, { foreignKey: 'informe_id' });

Historial_Pedidos.hasMany(Pedido_Venta, { foreignKey: 'historial_id' });
Pedido_Venta.belongsTo(Historial_Pedidos, { foreignKey: 'historial_id' });

export { Pedido_Venta };
