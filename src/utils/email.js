import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del transportador
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  secure: false, // Cambia a true si usas SSL
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Función para enviar un correo electrónico.
 * @param {string} to - Dirección de correo del destinatario.
 * @param {string} subject - Asunto del correo.
 * @param {string} text - Contenido del correo.
 * @returns {Promise} - Promesa que se resuelve si se envía el correo, o se rechaza en caso de error.
 */
export const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar correo:', error);
        return reject(error);
      } else {
        console.log('Correo enviado:', info.response);
        return resolve(info);
      }
    });
  });
};
