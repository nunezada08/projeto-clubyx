import SimuladoModel from '../models/SimuladoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, materia, resumo } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }

        if (!materia) {
            return res.status(400).json({ error: 'O campo "materia" é obrigatório!' });
        }

        if (!resumo) {
            return res.status(400).json({ error: 'O campo "resumo" é obrigatório!' });
        }

        const simulado = new SimuladoModel({ nome, materia, resumo });
        const data = await simulado.criar();

        return res.status(201).json({ message: 'simulado criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o simulado.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await SimuladoModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum Simulado encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar Simulados.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const simulado = await SimuladoModel.buscarPorId(parseInt(id, 10));

        if (!simulado) {
            return res.status(404).json({ error: 'Simulado não encontrado.' });
        }

        return res.status(200).json({ data: simulado });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar Simulado.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const simulado = await SimuladoModel.buscarPorId(parseInt(id, 10));

        if (!simulado) {
            return res.status(404).json({ error: 'Simulado não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            simulado.nome = req.body.nome;
        }
        if (req.body.materia !== undefined) {
            simulado.materia = req.body.materia;
        }
        if (req.body.resumo !== undefined) {
            simulado.resumo = req.body.resumo;
        }
        const data = await simulado.atualizar();

        return res
            .status(200)
            .json({ message: `O Simulado "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar Simulado.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const simulado = await SimuladoModel.buscarPorId(parseInt(id, 10));

        if (!simulado) {
            return res.status(404).json({ error: 'Simulado não encontrado para deletar.' });
        }

        await simulado.deletar();

        return res.status(200).json({
            message: `O Simulado "${simulado.nome}" foi deletado com sucesso!`,
            deletado: simulado,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar simulado.' });
    }
};
