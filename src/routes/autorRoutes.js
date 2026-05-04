import express from 'express';
import * as controller from '../controllers/autorController.js';

const router = express.Router();

router.post('/autores', controller.criar);
router.get('/autores', controller.buscarTodos);
router.get('/autores/:id', controller.buscarPorId);
router.put('/autores/:id', controller.atualizar);
router.delete('/autores/:id', controller.deletar);

export default router;
