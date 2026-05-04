import express from 'express';
import * as controller from '../controllers/conteudoController.js';

const router = express.Router();

router.post('/conteudos', controller.criar);
router.get('/conteudos', controller.buscarTodos);
router.get('/conteudos/:id', controller.buscarPorId);
router.put('/conteudos/:id', controller.atualizar);
router.delete('/conteudos/:id', controller.deletar);

export default router;
