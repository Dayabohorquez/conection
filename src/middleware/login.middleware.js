// path/to/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
  // Obtener el encabezado de autorización
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Verificar si el token está presente
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    // Guardar información del usuario en el request
    req.user = user;
    next();
  });
};

// Función para verificar roles (opcional)
export const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'Acceso denegado: rol no autorizado' });
    }
    next();
  };
};
