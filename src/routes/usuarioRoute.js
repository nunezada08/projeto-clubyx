import express from 'express';
import * as controller from '../controllers/usuarioController.js';

const router = express.Router();

router.post('/usuario', controller.criar);
router.get('/usuario', controller.buscarTodos);
router.get('/usuario/:id', controller.buscarPorId);
router.put('/usuario/:id', controller.atualizar);
router.delete('/usuario/:id', controller.deletar);

export default router;
