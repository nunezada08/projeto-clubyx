import express from 'express';
import * as controller from '../controllers/simuladoController.js';

const router = express.Router();

router.post('/simulados', controller.criar);
router.get('/simulados', controller.buscarTodos);
router.get('/simulados/:id', controller.buscarPorId);
router.put('/simulados/:id', controller.atualizar);
router.delete('/simulados/:id', controller.deletar);

export default router;
