import OpcionAdicional from '../models/Opciones_adicionales.js';

class OpcionAdicionalController {
    // Obtener todas las opciones adicionales
    static async obtenerOpciones(req, res) {
        try {
            const opciones = await OpcionAdicional.obtenerOpciones();
            res.status(200).json(opciones);
        } catch (error) {
            console.error('Error al obtener opciones adicionales:', error);
            res.status(500).json({ message: 'Error al obtener opciones adicionales', error });
        }
    }

    // Crear una nueva opción adicional
    static async crearOpcion(req, res) {
        const { opcion_adicional, precio_adicional } = req.body;
        try {
            await OpcionAdicional.crear(opcion_adicional, precio_adicional);
            res.status(201).json({ message: 'Opción adicional creada exitosamente.' });
        } catch (error) {
            console.error('Error al crear opción adicional:', error);
            res.status(500).json({ message: 'Error al crear opción adicional', error: error.message });
        }
    }

    // Actualizar opción adicional por ID
    static async actualizarOpcion(req, res) {
        const { id_opcion } = req.params;
        const { nueva_opcion_adicional, nuevo_precio_adicional } = req.body;
        try {
            await OpcionAdicional.actualizar(id_opcion, nueva_opcion_adicional, nuevo_precio_adicional);
            res.status(200).json({ message: 'Opción adicional actualizada exitosamente.' });
        } catch (error) {
            console.error('Error al actualizar opción adicional:', error);
            res.status(500).json({ message: 'Error al actualizar opción adicional', error: error.message });
        }
    }

    // Eliminar opción adicional por ID
    static async eliminarOpcion(req, res) {
        const { id_opcion } = req.params; // Asegúrate de que estás obteniendo el ID correctamente
        try {
            await OpcionAdicional.eliminar(id_opcion);
            res.status(200).json({ message: 'Opción adicional eliminada exitosamente.' });
        } catch (error) {
            console.error('Error al eliminar opción adicional:', error);
            res.status(500).json({ message: 'Error al eliminar opción adicional', error: error.message });
        }
    }
}

export default OpcionAdicionalController;
