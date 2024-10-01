    import { Router } from 'express';
    import TipoFlorController from '../controllers/tipoFlor.controller.js';

    // Inicializamos el enrutador
    const router = Router();

    // Obtener todos los tipos de flores
    router.get('/api/tipos-flor', TipoFlorController.getTiposFlor);

    // Obtener un tipo de flor por ID
    router.get('/api/tipo-flor/:id', TipoFlorController.getTipoFlorById);

    router.put('/api/tipo-flor/:id_tipo_flor', TipoFlorController.updateTipoFlor);
    router.post('/api/tipo-flor', TipoFlorController.createTipoFlor);    

    // Eliminar un tipo de flor
    router.delete('/api/tipo-flor/:id', TipoFlorController.deleteTipoFlor);

    export default router;