import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

// Ruta para solicitar restablecimiento de contraseña
router.post('/api/request-password-reset', AuthController.requestPasswordReset);

// Ruta para restablecer la contraseña con el token
router.post('/api/reset-password', AuthController.resetPassword);

router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    // Renderiza el formulario o página de restablecimiento con el token
    res.send(`
        <form action="/reset-password" method="POST">
            <input type="hidden" name="token" value="${token}" />
            <input type="password" name="nueva_contrasena" placeholder="Nueva contraseña" required />
            <button type="submit">Restablecer contraseña</button>
        </form>
    `);
});


export default router;
