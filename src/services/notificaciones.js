import nodemailer from 'nodemailer';

// Crear un transportador con nodemailer para el correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
}, {
    logger: true,
    debug: true,
});

// Función para enviar una notificación al administrador (por ejemplo, en caso de un pedido cancelado)
export const enviarNotificacionAdministrador = async (mensaje) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'Notificación de Pedido Cancelado',
        text: mensaje,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Notificación enviada al administrador');
    } catch (error) {
        console.error('Error al enviar notificación:', error);
    }
};

// Notificar al administrador sobre un pago fallido
export const sendNotification = async (pagoData) => {
    const { documento, metodo_pago, total_pago } = pagoData;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'Notificación de Pago Fallido',
        text: `El pago ha fallado.\n\nDetalles del pago:\n- Documento: ${documento}\n- Método de Pago: ${metodo_pago}\n- Total: ${total_pago}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Notificación de pago fallido enviada');
    } catch (error) {
        console.error('Error al enviar notificación de pago fallido:', error);
    }
};

// Enviar notificación al administrador cuando un producto está agotado
export const enviarCorreoStockAgotado = async (productos) => {
    console.log('Ejecutando función para enviar correo...');

    // Asegurarse de que los productos son un arreglo de objetos
    if (Array.isArray(productos) && productos.length > 0) {
        try {
            // Crear un listado de los productos agotados
            const productosInfo = productos.map(producto => {
                // Asegúrate de que los productos tienen las propiedades correctas
                return `Producto: ${producto.nombre_producto} (Codigó: ${producto.codigo_producto}) - Stock: ${producto.cantidad_disponible}`;
            }).join('\n');  // Crear una cadena de texto con todos los productos

            console.log('Productos agotados:', productosInfo);  // Verificar los productos

            // Enviar el correo al administrador con el listado de productos agotados
            const info = await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL,
                subject: '¡Stock Agotado! Productos sin stock',
                text: `Los siguientes productos están agotados:\n\n${productosInfo}`,  // Enviar los productos agotados
            });

            console.log('Correo enviado:', info.messageId);
        } catch (error) {
            console.error('Error al enviar correo:', error);
        }
    } else {
        console.log('No hay productos agotados para notificar.');
    }
};
