import nodemailer from 'nodemailer';

// Configuración del transporte de nodemailer para el envío de correos
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // Ignora certificados autofirmados
    },
});

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

export const sendNotification = (pagoData) => {
    const { documento, metodo_pago, total_pago } = pagoData;
    const mailOptions = {
        from: 'dayabohorquez93@gmail.com', // remitente
        to: 'dayabohorquez93@gmail.com', // correo del administrador
        subject: 'Notificación de Pago Fallido',
        text: `El pago ha fallado.\n\nDetalles del pago:\n- Documento: ${documento}\n- Método de Pago: ${metodo_pago}\n- Total: ${total_pago}`
    };

    return transporter.sendMail(mailOptions);
};