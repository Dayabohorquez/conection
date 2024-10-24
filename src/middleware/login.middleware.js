import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express from 'express'

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    req.user = user; // Almacena el usuario en el request para uso posterior
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
