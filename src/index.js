import express from 'express';
import { sequelize } from './config/db.js';
import usuarioRoutes from './routes/usuario.routes.js'; 
import productoRoutes from './routes/producto.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';
import pedido_ventaRoutes from './routes/pedido_venta.routes.js';
import pagoRoutes from './routes/pago.routes.js';
import informe_pedidoRoutes from './routes/informe_pedido.routes.js';
import historial_pedidoRoutes from './routes/historial_pedido.routes.js';
import envioRoutes from './routes/envio.routes.js';
import detalle_pedidoRoutes from './routes/detalle_pedido.routes.js';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use('/api', usuarioRoutes); 
app.use('/api', productoRoutes); 
app.use('/api', pedidoRoutes); 
app.use('/api', pedido_ventaRoutes);
app.use('/api', pagoRoutes);
app.use('/api', informe_pedidoRoutes);
app.use('/api', historial_pedidoRoutes);
app.use('/api', envioRoutes);
app.use('/api', detalle_pedidoRoutes);

sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');
    })
    .catch((err) => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
