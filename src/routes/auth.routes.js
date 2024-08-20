import express from 'express';
import { handleAuth } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/auth', handleAuth);

export default router;
