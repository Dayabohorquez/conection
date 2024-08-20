import express from 'express';
import cors from 'cors';
import usuarioRoutes from './src/routes/usuario.routes.js';
import productoRoutes from './src/routes/producto.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';
import pedido_ventaRoutes from './routes/pedido_venta.routes.js';
import pagoRoutes from './routes/pago.routes.js';
import informe_pedidoRoutes from './routes/informe_pedido.routes.js';
import historial_pedidoRoutes from './routes/historial_pedido.routes.js';
import envioRoutes from './routes/envio.routes.js';
import detalle_pedidoRoutes from './routes/detalle_pedido.routes.js';
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(express.json())
app.use(cors())

app.use(usuarioRoutes, productoRoutes, pedidoRoutes, pedido_ventaRoutes, pagoRoutes, informe_pedidoRoutes, historial_pedidoRoutes, envioRoutes, detalle_pedidoRoutes, authRoutes)

export default app