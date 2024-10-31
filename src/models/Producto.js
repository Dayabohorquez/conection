import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import TipoFlor from '../models/TipoFlor.js';
import Evento from '../models/Evento.js';

class Producto extends Model {
  // Obtener todos los productos
  static async obtenerProductos() {
    try {
      const productos = await sequelize.query('CALL ObtenerProductos()', { type: QueryTypes.RAW });
      return productos;
    } catch (error) {
      console.error(`No se pudieron obtener los productos: ${error}`);
      throw error;
    }
  }

  // Obtener producto por ID
  static async obtenerProductoPorId(id_producto) {
    try {
      const producto = await sequelize.query('CALL ObtenerProductoPorId(:id)', {
        replacements: { id: id_producto },
        type: QueryTypes.RAW,
      });
      return producto[0]; // Devuelve el primer resultado
    } catch (error) {
      console.error(`No se pudo encontrar el producto: ${error}`);
      throw error;
    }
  }

  // Obtener productos por tipo de flor con paginación
  static async obtenerProductosPorTipoFlor(tipoFlorId, limit = 5, offset = 0) {
    try {
      const productos = await sequelize.query(
        'CALL ObtenerProductosPorTipoFlor(:tipoFlorId, :limit, :offset)',
        {
          replacements: { tipoFlorId, limit, offset },
          type: QueryTypes.RAW
        }
      );
      return productos;
    } catch (error) {
      console.error(`No se pudieron obtener productos por tipo de flor: ${error}`);
      throw error;
    }
  }

  // Obtener productos por fecha especial con paginación
  static async obtenerProductosPorFechaEspecial(fechaEspecialId, limit = 5, offset = 0) {
    try {
      const productos = await sequelize.query(
        'CALL ObtenerProductosPorFechaEspecial(:fechaEspecialId, :limit, :offset)',
        {
          replacements: { fechaEspecialId, limit, offset },
          type: QueryTypes.RAW
        }
      );
      return productos;
    } catch (error) {
      console.error(`No se pudieron obtener productos por fecha especial: ${error}`);
      throw error;
    }
  }

  // Crear nuevo producto
  static async crearProducto({
    codigo_producto,
    nombre_producto,
    foto_Producto,
    foto_ProductoURL,
    descripcion_producto,
    precio_producto,
    cantidad_disponible,
    id_tipo_flor,
    id_evento,
    id_fecha_especial
  }) {
    try {
      await sequelize.query(`
        CALL CrearProducto(
          :codigo_producto,
          :nombre_producto,
          :foto_Producto,
          :foto_ProductoURL,
          :descripcion_producto,
          :precio_producto,
          :cantidad_disponible,
          :id_tipo_flor,
          :id_evento,
          :id_fecha_especial
        );`, {
        replacements: {
          codigo_producto,
          nombre_producto,
          foto_Producto,
          foto_ProductoURL,
          descripcion_producto,
          precio_producto,
          cantidad_disponible,
          id_tipo_flor,
          id_evento,
          id_fecha_especial
        },
        type: QueryTypes.RAW
      });

      return { message: 'Producto creado exitosamente' };
    } catch (error) {
      console.error(`No se pudo crear el producto: ${error}`);
      throw error;
    }
  }

  // Actualizar producto
  static async actualizarProducto({
    id_producto,
    codigo_producto,
    nombre_producto,
    foto_Producto,
    foto_ProductoURL,
    descripcion_producto,
    precio_producto,
    id_tipo_flor,
    id_evento,
    id_fecha_especial
  }) {
    try {
      await sequelize.query(`
        CALL ActualizarProducto(
          :id_producto,
          :codigo_producto,
          :nombre_producto,
          :foto_Producto,
          :foto_ProductoURL,
          :descripcion_producto,
          :precio_producto,
          :id_tipo_flor,
          :id_evento,
          :id_fecha_especial
        );`, {
        replacements: {
          id_producto,
          codigo_producto,
          nombre_producto,
          foto_Producto: foto_Producto || null,
          foto_ProductoURL: foto_ProductoURL || null,
          descripcion_producto,
          precio_producto,
          id_tipo_flor,
          id_evento,
          id_fecha_especial
        },
        type: QueryTypes.RAW
      });

      return { message: 'Producto actualizado exitosamente' };
    } catch (error) {
      console.error(`Error al actualizar el producto: ${error}`);
      throw error;
    }
  }

  static async actualizarCantidadDisponible(id_producto, nueva_cantidad) {
    try {
        await sequelize.query('CALL ActualizarCantidadDisponible(:id_producto, :nueva_cantidad)', {
            replacements: { id_producto, nueva_cantidad },
            type: QueryTypes.RAW
        });
        return { message: 'Cantidad disponible actualizada' };
    } catch (error) {
        console.error(`No se pudo actualizar la cantidad disponible: ${error}`);
        throw error;
    }
}

  // Cambiar estado de un producto (activado/desactivado)
  static async cambiarEstadoProducto(id_producto, nuevo_estado) {
    try {
      await sequelize.query('CALL CambiarEstadoProducto(:id_producto, :nuevo_estado)', {
        replacements: { id_producto, nuevo_estado },
        type: QueryTypes.RAW
      });
      return { message: 'Estado del producto actualizado' };
    } catch (error) {
      console.error(`No se pudo cambiar el estado del producto: ${error}`);
      throw error;
    }
  }

}

// Definición del modelo Producto
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
  },
  id_fecha_especial: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Fecha_Especial',
      key: 'id_fecha_especial'
    }
  }
}, {
  sequelize,
  tableName: 'Producto',
  timestamps: false,
  underscored: false,
});

export default Producto;
