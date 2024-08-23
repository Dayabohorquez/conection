import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Producto extends Model {
    // Método para crear un nuevo producto
    static async createProducto(producto) {
        try {
            return await this.create(producto);
        } catch (error) {
            console.error(`Unable to create producto: ${error}`);
            throw error;
        }
    }

    // Método para obtener todos los productos
    static async getProductos() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all productos: ${error}`);
            throw error;
        }
    }

    // Método para obtener un producto por su ID
    static async getProductoById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find producto by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar un producto
    static async updateProducto(id, updated_producto) {
        try {
            const producto = await this.findByPk(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }
            return await producto.update(updated_producto);
        } catch (error) {
            console.error(`Unable to update the producto: ${error}`);
            throw error;
        }
    }

    // Método para alternar el estado del producto
    static async toggleProductoState(id) {
        try {
            const producto = await this.findByPk(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }
            const newState = producto.estado_producto === '1' ? '0' : '1';
            await producto.update({ estado_producto: newState });
            return producto;
        } catch (error) {
            console.error(`Unable to toggle producto state: ${error}`);
            throw error;
        }
    }
}

// Definición del modelo Producto en Sequelize
Producto.init({
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_producto: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    foto_Producto: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    foto_ProductoURL: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    descripcion_producto: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    precio_producto: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    estado_producto: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    tipo_producto: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'Producto',
    timestamps: false,
    underscored: false,
});

export { Producto };