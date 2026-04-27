import express from 'express';
import * as controller from '../controllers/questaoController.js';

const router = express.Router();

router.post('/questoes', controller.criar);
router.get('/questoes', controller.buscarTodos);
router.get('/questoes/:id', controller.buscarPorId);
router.put('/questoes/:id', controller.atualizar);
router.delete('/questoes/:id', controller.deletar);
export default router;
