import express from 'express';
import * as controller from '../controllers/integranteController.js';

const router = express.Router();

router.post('/integrantes', controller.criar);
router.get('/integrantes', controller.buscarTodos);
router.get('/integrantes/:id', controller.buscarPorId);
router.put('/integrantes/:id', controller.atualizar);
router.delete('/integrantes/:id', controller.deletar);

export default router;
