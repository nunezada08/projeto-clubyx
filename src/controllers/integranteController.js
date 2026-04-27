import IntegranteModel from '../models/IntegranteModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, curso, foto, equipeId } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }

        if (!curso) {
            return res.status(400).json({ error: 'O campo "curso" é obrigatório!' });
        }

        if (equipeId === undefined || Number.isNaN(parseInt(equipeId, 10))) {
            return res.status(400).json({ error: 'O campo "equipeId" é obrigatório e deve ser numérico!' });
        }

        const integrante = new IntegranteModel({ nome, curso, foto, equipeId: parseInt(equipeId, 10) });
        const data = await integrante.criar();

        return res.status(201).json({ message: 'Integrante criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o Integrante.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await IntegranteModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum Integrante encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar Integrantes.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const integrante = await IntegranteModel.buscarPorId(parseInt(id, 10));

        if (!integrante) {
            return res.status(404).json({ error: 'Integrante não encontrado.' });
        }

        return res.status(200).json({ data: integrante });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar Integrante.' });
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

        const integrante = await IntegranteModel.buscarPorId(parseInt(id, 10));

        if (!integrante) {
            return res.status(404).json({ error: 'Integrante não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            integrante.nome = req.body.nome;
        }
        if (req.body.curso !== undefined) {
            integrante.curso = req.body.curso;
        }
        if (req.body.foto !== undefined) {
            integrante.foto = req.body.foto;
        }
        if (req.body.equipeId !== undefined) {
            const parsedEquipeId = parseInt(req.body.equipeId, 10);
            if (Number.isNaN(parsedEquipeId)) {
                return res.status(400).json({ error: 'O campo "equipeId" deve ser numérico.' });
            }
            integrante.equipeId = parsedEquipeId;
        }

        const data = await integrante.atualizar();

        return res.status(200).json({ message: `O Integrante "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar Integrante.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const integrante = await IntegranteModel.buscarPorId(parseInt(id, 10));

        if (!integrante) {
            return res.status(404).json({ error: 'Integrante não encontrado para deletar.' });
        }

        await integrante.deletar();

        return res.status(200).json({ message: `O Integrante "${integrante.nome}" foi deletado com sucesso!`, deletado: integrante });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar integrante.' });
    }
};
