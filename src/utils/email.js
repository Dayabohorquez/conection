import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Verificar si las variables de entorno están definidas correctamente
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
  console.error('ERROR: Las variables de entorno EMAIL_USER, EMAIL_PASS o ADMIN_EMAIL no están definidas en el archivo .env');
  process.exit(1); // Detener la ejecución si no están definidas
}

// Configuración del transportador de correos (usando Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usar el servicio de Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true, // Usar SSL para asegurar la conexión
  tls: {
    rejectUnauthorized: false, // Asegurarse de que el certificado sea válido
  },
});

/**
 * Función para enviar un correo electrónico.
 * @param {string} to - Dirección de correo del destinatario.
 * @param {string} subject - Asunto del correo.
 * @param {string} text - Cuerpo del correo.
 * @returns {Promise} - Promesa que se resuelve si el correo es enviado correctamente.
 */
export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Correo del remitente (configurado en el archivo .env)
    to, // Correo del destinatario
    subject, // Asunto del correo
    text, // Cuerpo del correo
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    return info; // Devolver la información del correo enviado
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw new Error('No se pudo enviar el correo'); // Lanza un error si falla el envío
  }
};
