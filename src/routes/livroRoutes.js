import express from 'express';
import * as controller from '../controllers/livroController.js';

const router = express.Router();

router.post('/livros', controller.criar);
router.get('/livros', controller.buscarTodos);
router.get('/livros/:id', controller.buscarPorId);
router.put('/livros/:id', controller.atualizar);
router.delete('/livros/:id', controller.deletar);

export default router;
