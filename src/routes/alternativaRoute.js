import express from 'express';
import * as controller from '../controllers/alternativaController.js';

const router = express.Router();

router.post('/alternativas', controller.criar);
router.get('/alternativas', controller.buscarTodos);
router.get('/alternativas/:id', controller.buscarPorId);
router.put('/alternativas/:id', controller.atualizar);
router.delete('/alternativas/:id', controller.deletar);

export default router;
