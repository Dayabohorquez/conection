import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

// Ruta para solicitar restablecimiento de contraseña
router.post('/api/request-password-reset', AuthController.requestPasswordReset);

// Ruta para restablecer la contraseña con el token
router.post('/api/reset-password', AuthController.resetPassword);

router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
});


export default router;
