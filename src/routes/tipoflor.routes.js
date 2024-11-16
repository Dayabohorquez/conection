    import { Router } from 'express';
    import tipoFlorController from './controllers/tipoFlor.controller.js';

    // Inicializamos el enrutador
    const router = Router();

    // Obtener todos los tipos de flores
    router.get('/api/tipos-flor', tipoFlorController.getTiposFlor);

    // Obtener un tipo de flor por ID
    router.get('/api/tipo-flor/:id', tipoFlorController.getTipoFlorById);

    router.put('/api/tipo-flor/:id_tipo_flor', tipoFlorController.putTipoFlor);

    router.post('/api/tipo-flor', tipoFlorController.postTipoFlor);    

    // Eliminar un tipo de flor
    router.delete('/api/tipo-flor/:id', tipoFlorController.deleteTipoFlor);

    export default router;