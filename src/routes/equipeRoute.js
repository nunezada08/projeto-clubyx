import express from 'express';
import * as controller from '../controllers/equipeController.js';

const router = express.Router();

router.post('/equipe', controller.criar);
router.get('/equipe', controller.buscarTodos);
router.get('/equipe/:id', controller.buscarPorId);
router.put('/equipe/:id', controller.atualizar);
router.delete('/equipe/:id', controller.deletar);

export default router;
