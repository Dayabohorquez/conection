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
      const [producto] = await sequelize.query('CALL ObtenerProductoPorId(:idProducto)', {
        replacements: { idProducto },
        type: QueryTypes.SELECT
      });
      return producto[0] || null; // Suponiendo que devuelve un array con un único objeto
    } catch (error) {
      console.error(`Unable to fetch producto by ID: ${error}`);
      throw error;
    }
  }

  // Crear nuevo producto
  static async crearProducto({ codigoProducto, nombreProducto, fotoProducto, foto_ProductoURL, descripcionProducto, precioProducto, estadoProducto, cantidadDisponible, idTipoFlor, idEvento }) {
    try {
      await sequelize.query('CALL CrearProducto(:codigoProducto, :nombreProducto, :fotoProducto, :foto_ProductoURL, :descripcionProducto, :precioProducto, :estadoProducto, :cantidadDisponible, :idTipoFlor, :idEvento)', {
        replacements: { codigoProducto, nombreProducto, fotoProducto, foto_ProductoURL, descripcionProducto, precioProducto, estadoProducto, cantidadDisponible, idTipoFlor, idEvento },
        type: QueryTypes.RAW
      });
      return { message: 'Producto creado exitosamente' };
    } catch (error) {
      console.error(`Unable to create producto: ${error}`);
      throw error;
    }
  }  

  // Actualizar un producto
  static async actualizarProducto({
    idProducto,
    codigoProducto,
    nombreProducto,
    fotoProducto,
    foto_ProductoURL,
    descripcionProducto,
    precioProducto,
    estadoProducto,
    cantidadDisponible,
    idTipoFlor,
    idEvento
  }) {
    try {
      await sequelize.query('CALL ActualizarProducto(:p_id_producto, :p_codigo_producto, :p_nombre_producto, :p_foto_Producto, :p_foto_ProductoURL, :p_descripcion_producto, :p_precio_producto, :p_estado_producto, :p_cantidad_disponible, :p_id_tipo_flor, :p_id_evento)', {
        replacements: {
          p_id_producto: idProducto,
          p_codigo_producto: codigoProducto,
          p_nombre_producto: nombreProducto,
          p_foto_Producto: fotoProducto,
          p_foto_ProductoURL: foto_ProductoURL,
          p_descripcion_producto: descripcionProducto,
          p_precio_producto: precioProducto,
          p_estado_producto: estadoProducto,
          p_cantidad_disponible: cantidadDisponible,
          p_id_tipo_flor: idTipoFlor,
          p_id_evento: idEvento
        },
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
  foto_producto: {
    type: DataTypes.TEXT
  },
  foto_productoURL: {
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
