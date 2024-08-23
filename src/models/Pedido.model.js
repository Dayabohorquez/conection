import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import { Usuario } from "./Usuario.model.js";
import { Pago } from "./Pago.model.js";

class Pedido extends Model {
    // Método para crear un nuevo pedido
    static async createPedido(pedido) {
        try {
            return await this.create(pedido);
        } catch (error) {
            console.error(`Unable to create pedido: ${error}`);
            throw error;
        }
    }

    // Método para obtener todos los pedidos
    static async getPedidos() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all pedidos: ${error}`);
            throw error;
        }
    }

    // Método para obtener un pedido por su ID
    static async getPedidoById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find pedido by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar un pedido
    static async updatePedido(id, updated_pedido) {
        try {
            const pedido = await this.findByPk(id);
            return pedido.update(updated_pedido);
        } catch (error) {
            console.error(`Unable to update the pedido: ${error}`);
            throw error;
        }
    }
}

// Definición del modelo Pedido en Sequelize
Pedido.init({
    id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_pedido: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado_pedido: {
        type: DataTypes.ENUM('Pendiente', 'Enviado', 'Entregado', 'Cancelado'),
        allowNull: false
    },
    total_pagado: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    },
    pago_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pago,
            key: 'id_pago'
        }
    }
}, {
    sequelize,
    tableName: 'Pedido',
    timestamps: false,
    underscored: false,
});

// Relaciones
Usuario.hasMany(Pedido, { foreignKey: 'usuario_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Pago.hasMany(Pedido, { foreignKey: 'pago_id' });
Pedido.belongsTo(Pago, { foreignKey: 'pago_id' });

export { Pedido };
