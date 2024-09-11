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

  // Obtener producto por ID
  static async obtenerProductoPorId(idProducto) {
    try {
      const producto = await sequelize.query('CALL ObtenerProductoPorId(:idProducto)', {
        replacements: { idProducto },
        type: QueryTypes.RAW
      });
      return producto;
    } catch (error) {
      console.error(`Unable to fetch producto by ID: ${error}`);
      throw error;
    }
  }

  // Crear nuevo producto
  static async crearProducto({ codigoProducto, nombreProducto, fotoProducto, fotoProductoURL, descripcionProducto, precioProducto, estadoProducto, cantidadDisponible, idTipoFlor, idEvento }) {
    try {
      await sequelize.query('CALL CrearProducto(:codigoProducto, :nombreProducto, :fotoProducto, :fotoProductoURL, :descripcionProducto, :precioProducto, :estadoProducto, :cantidadDisponible, :idTipoFlor, :idEvento)', {
        replacements: { codigoProducto, nombreProducto, fotoProducto, fotoProductoURL, descripcionProducto, precioProducto, estadoProducto, cantidadDisponible, idTipoFlor, idEvento },
        type: QueryTypes.RAW
      });
      return { message: 'Producto creado exitosamente' };
    } catch (error) {
      console.error(`Unable to create producto: ${error}`);
      throw error;
    }
  }

  // Actualizar un producto
  static async actualizarProducto(idProducto, { codigoProducto, nombreProducto, fotoProducto, fotoProductoURL, descripcionProducto, precioProducto, estadoProducto, cantidadDisponible, idTipoFlor, idEvento }) {
    try {
      await sequelize.query('CALL ActualizarProducto(:idProducto, :codigoProducto, :nombreProducto, :fotoProducto, :fotoProductoURL, :descripcionProducto, :precioProducto, :estadoProducto, :cantidadDisponible, :idTipoFlor, :idEvento)', {
        replacements: { idProducto, codigoProducto, nombreProducto, fotoProducto, fotoProductoURL, descripcionProducto, precioProducto, estadoProducto, cantidadDisponible, idTipoFlor, idEvento },
        type: QueryTypes.RAW
      });
      return { message: 'Producto actualizado exitosamente' };
    } catch (error) {
      console.error(`Unable to update producto: ${error}`);
      throw error;
    }
  }

  // Cambiar estado de un producto (activado/desactivado)
  static async cambiarEstadoProducto(idProducto) {
    try {
      await sequelize.query('CALL CambiarEstadoProducto(:idProducto)', {
        replacements: { idProducto },
        type: QueryTypes.RAW
      });
      return { message: 'Estado de producto actualizado' };
    } catch (error) {
      console.error(`Unable to toggle producto state: ${error}`);
      throw error;
    }
  }

  // Eliminar un producto
  static async eliminarProducto(idProducto) {
    try {
      await sequelize.query('CALL EliminarProducto(:idProducto)', {
        replacements: { idProducto },
        type: QueryTypes.RAW
      });
      return { message: 'Producto eliminado exitosamente' };
    } catch (error) {
      console.error(`Unable to delete producto: ${error}`);
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
