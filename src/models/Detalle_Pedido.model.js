import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import { Pedido } from "./Pedido.model.js";
import { Producto } from "./Producto.model.js";

class Detalle_Pedido extends Model {
    // Método para crear un nuevo detalle de pedido
    static async createDetallePedido(detallePedido) {
        try {
            return await this.create(detallePedido);
        } catch (error) {
            console.error(`Unable to create Detalle_Pedido: ${error}`);
            throw error;
        }
    }

    // Método para obtener todos los detalles de pedidos
    static async getDetallesPedidos() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all Detalles_Pedidos: ${error}`);
            throw error;
        }
    }

    // Método para obtener un detalle de pedido por ID
    static async getDetallePedidoById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find Detalle_Pedido by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar un detalle de pedido
    static async updateDetallePedido(id, updatedDetallePedido) {
        try {
            const detallePedido = await this.findByPk(id);
            if (detallePedido) {
                return await detallePedido.update(updatedDetallePedido);
            }
            throw new Error('Detalle de pedido no encontrado');
        } catch (error) {
            console.error(`Unable to update Detalle_Pedido: ${error}`);
            throw error;
        }
    }
}

// Definición del modelo Detalle_Pedido en Sequelize
Detalle_Pedido.init({
    id_detalle_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_unitario: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pedido,
            key: 'id_pedido'
        }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id_producto'
        }
    }
}, {
    sequelize,
    tableName: 'Detalle_Pedido',
    timestamps: false,
    underscored: false,
});

// Relaciones
Pedido.hasMany(Detalle_Pedido, { foreignKey: 'pedido_id' });
Detalle_Pedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

Producto.hasMany(Detalle_Pedido, { foreignKey: 'producto_id' });
Detalle_Pedido.belongsTo(Producto, { foreignKey: 'producto_id' });

export { Detalle_Pedido };
