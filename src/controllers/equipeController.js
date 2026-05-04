import EquipeModel from '../models/EquipeModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }

        const equipe = new EquipeModel({ nome });
        const data = await equipe.criar();

        return res.status(201).json({ message: 'Equipe criada com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o Equipe.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await EquipeModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhuma equipe encontrada.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar equipes.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const equipe = await EquipeModel.buscarPorId(parseInt(id, 10));

        if (!equipe) {
            return res.status(404).json({ error: 'Equipe não encontrada.' });
        }

        return res.status(200).json({ data: equipe });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar Equipe.' });
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

        const equipe = await EquipeModel.buscarPorId(parseInt(id, 10));

        if (!equipe) {
            return res.status(404).json({ error: 'Equipe não encontrada para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            equipe.nome = req.body.nome;
        }

        const data = await equipe.atualizar();

        return res.status(200).json({ message: `A equipe "${data.nome}" foi atualizada com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar Equipe.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const equipe = await EquipeModel.buscarPorId(parseInt(id, 10));

        if (!equipe) {
            return res.status(404).json({ error: 'Equipe não encontrada para deletar.' });
        }

        if (equipe.integrantes && equipe.integrantes.length > 0) {
            return res.status(409).json({ error: 'Não é possível deletar a equipe porque existem integrantes vinculados.' });
        }

        await equipe.deletar();

        return res.status(200).json({ message: `A equipe "${equipe.nome}" foi deletada com sucesso!`, deletado: equipe });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        if (error.code === 'P2003') {
            return res.status(409).json({ error: 'Não é possível deletar a equipe porque existem integrantes vinculados.' });
        }
        return res.status(500).json({ error: 'Erro ao deletar equipe.' });
    }
};
