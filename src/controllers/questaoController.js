import QuestaoModel from '../models/QuestaoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { enunciado, explicacao, simuladoId } = req.body;

        if (!enunciado) {
            return res.status(400).json({ error: 'O campo "enunciado" é obrigatório!' });
        }

        if (simuladoId === undefined || Number.isNaN(parseInt(simuladoId, 10))) {
            return res
                .status(400)
                .json({ error: 'O campo "simuladoId" é obrigatório e deve ser numérico!' });
        }

        const questao = new QuestaoModel({
            enunciado,
            explicacao,
            simuladoId: parseInt(simuladoId, 10),
        });

        const data = await questao.criar();

        return res.status(201).json({ message: 'Questão criada com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar a Questão.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await QuestaoModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhuma Questão encontrada.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar Questões.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const questao = await QuestaoModel.buscarPorId(parseInt(id, 10));

        if (!questao) {
            return res.status(404).json({ error: 'Questão não encontrada.' });
        }

        return res.status(200).json({ data: questao });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar Questão.' });
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

        const questao = await QuestaoModel.buscarPorId(parseInt(id, 10));

        if (!questao) {
            return res.status(404).json({ error: 'Questão não encontrada para atualizar.' });
        }

        if (req.body.enunciado !== undefined) {
            questao.enunciado = req.body.enunciado;
        }
        if (req.body.explicacao !== undefined) {
            questao.explicacao = req.body.explicacao;
        }
        if (req.body.simuladoId !== undefined) {
            const parsedSimuladoId = parseInt(req.body.simuladoId, 10);
            if (Number.isNaN(parsedSimuladoId)) {
                return res.status(400).json({ error: 'O campo "simuladoId" deve ser numérico.' });
            }
            questao.simuladoId = parsedSimuladoId;
        }

        const data = await questao.atualizar();

        return res.status(200).json({ message: 'Questão atualizada com sucesso!', data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar Questão.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const questao = await QuestaoModel.buscarPorId(parseInt(id, 10));

        if (!questao) {
            return res.status(404).json({ error: 'Questão não encontrada para deletar.' });
        }

        await questao.deletar();

        return res
            .status(200)
            .json({ message: 'Questão deletada com sucesso!', deletado: questao });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar Questão.' });
    }
};
