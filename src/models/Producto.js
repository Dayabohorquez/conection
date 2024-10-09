import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import TipoFlor from '../models/TipoFlor.js';
import Evento from '../models/Evento.js';

class Producto extends Model {
  // Obtener todos los productos
  static async obtenerProductos() {
    try {
      const productos = await sequelize.query('CALL ObtenerProductos()', { type: QueryTypes.RAW });
      return productos;
    } catch (error) {
      console.error(`Unable to fetch productos: ${error}`);
      throw error;
    }
  }

  // Obtener productos por tipo de flor
  static async obtenerProductosPorTipoFlor(tipoFlorId) {
    try {
      const productos = await sequelize.query('CALL ObtenerProductosPorTipoFlor(:tipoFlorId)', {
        replacements: { tipoFlorId },
        type: QueryTypes.RAW
      });
      return productos;
    } catch (error) {
      console.error(`Unable to fetch productos by tipo flor: ${error}`);
      throw error;
    }
  }

  static async crearProducto({
    codigo_producto,
    nombre_producto,
    foto_Producto,
    foto_ProductoURL,
    descripcion_producto,
    precio_producto,
    cantidad_disponible,
    id_tipo_flor,
    id_evento
  }) {
    try {
      const query = `
            CALL CrearProducto(
                :codigo_producto,
                :nombre_producto,
                :foto_Producto,
                :foto_ProductoURL,
                :descripcion_producto,
                :precio_producto,
                :cantidad_disponible,
                :id_tipo_flor,
                :id_evento
            );
        `;

      const replacements = {
        codigo_producto,
        nombre_producto,
        foto_Producto,
        foto_ProductoURL,
        descripcion_producto,
        precio_producto,
        cantidad_disponible,
        id_tipo_flor,
        id_evento,
      };

      await sequelize.query(query, {
        replacements,
        type: QueryTypes.RAW
      });

      return { message: 'Producto creado exitosamente' };
    } catch (error) {
      console.error(`Unable to create producto: ${error}`);
      throw error;
    }
  }

  static async actualizarProducto({
    id_producto,
    codigo_producto,
    nombre_producto,
    foto_Producto, // Ahora puede ser undefined
    foto_ProductoURL, // Ahora puede ser undefined
    descripcion_producto,
    precio_producto,
    cantidad_disponible,
    id_tipo_flor,
    id_evento
}) {
    try {
        const query = `
            CALL actualizarProducto(
                :id_producto,
                :codigo_producto,
                :nombre_producto,
                :foto_producto, 
                :foto_productoURL, 
                :descripcion_producto,
                :precio_producto,
                :cantidad_disponible,
                :id_tipo_flor,
                :id_evento
            );
        `;

        const replacements = {
            id_producto,
            codigo_producto,
            nombre_producto,
            foto_producto: foto_Producto || null, // Usa null si no hay nueva foto
            foto_productoURL: foto_ProductoURL || null, // Usa null si no hay nueva URL
            descripcion_producto,
            precio_producto,
            cantidad_disponible,
            id_tipo_flor,
            id_evento,
        };

        await sequelize.query(query, { replacements, type: QueryTypes.RAW });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        throw error; // Re-lanzar el error para manejarlo en otro lugar
    }
}

  // Cambiar estado de un producto (activado/desactivado)
  static async cambiarEstadoProducto(idProducto, nuevoEstado) {
  try {
    await sequelize.query('CALL CambiarEstadoProducto(:idProducto, :nuevoEstado)', {
      replacements: { idProducto, nuevoEstado },
      type: QueryTypes.RAW
    });
    return { message: 'Estado de producto actualizado' };
  } catch (error) {
    console.error(`Unable to toggle producto state: ${error}`);
    throw error;
  }
}
}

Producto.init({
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo_producto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre_producto: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  foto_Producto: {
    type: DataTypes.TEXT
  },
  foto_ProductoURL: {
    type: DataTypes.TEXT
  },
  descripcion_producto: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  precio_producto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado_producto: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  cantidad_disponible: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  id_tipo_flor: {
    type: DataTypes.INTEGER,
    references: {
      model: TipoFlor,
      key: 'id_tipo_flor'
    }
  },
  id_evento: {
    type: DataTypes.INTEGER,
    references: {
      model: Evento,
      key: 'id_evento'
    }
  }
}, {
  sequelize,
  tableName: 'Producto',
  timestamps: false,
  underscored: false,
});

export default Producto;
