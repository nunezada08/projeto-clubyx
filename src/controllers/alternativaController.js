import AlternativaModel from '../models/AlternativaModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { texto, correta, questaoId } = req.body;

        if (!texto) {
            return res.status(400).json({ error: 'O campo "texto" é obrigatório!' });
        }

        if (correta !== undefined && typeof correta !== 'boolean') {
            return res.status(400).json({ error: 'O campo "correta" deve ser booleano.' });
        }

        if (questaoId === undefined || Number.isNaN(parseInt(questaoId, 10))) {
            return res.status(400).json({ error: 'O campo "questaoId" é obrigatório e deve ser numérico!' });
        }

        const alternativa = new AlternativaModel({
            texto,
            correta: correta ?? false,
            questaoId: parseInt(questaoId, 10),
        });

        const data = await alternativa.criar();

        return res.status(201).json({ message: 'Alternativa criada com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar a Alternativa.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await AlternativaModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhuma Alternativa encontrada.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar alternativa.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const alternativa = await AlternativaModel.buscarPorId(parseInt(id, 10));

        if (!alternativa) {
            return res.status(404).json({ error: 'Alternativa não encontrada.' });
        }

        return res.status(200).json({ data: alternativa });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar Alternativa.' });
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

        const alternativa = await AlternativaModel.buscarPorId(parseInt(id, 10));

        if (!alternativa) {
            return res.status(404).json({ error: 'Alternativa não encontrada para atualizar.' });
        }

        if (req.body.texto !== undefined) {
            alternativa.texto = req.body.texto;
        }

        if (req.body.correta !== undefined) {
            if (typeof req.body.correta !== 'boolean') {
                return res.status(400).json({ error: 'O campo "correta" deve ser booleano.' });
            }
            alternativa.correta = req.body.correta;
        }

        if (req.body.questaoId !== undefined) {
            const parsedQuestaoId = parseInt(req.body.questaoId, 10);
            
            if (Number.isNaN(parsedQuestaoId)) {
                return res.status(400).json({ error: 'O campo "questaoId" deve ser numérico.' });
            }
            alternativa.questaoId = parsedQuestaoId;
        }

        const data = await alternativa.atualizar();

        return res.status(200).json({ message: 'Alternativa atualizada com sucesso!', data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar Alternativa.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const alternativa = await AlternativaModel.buscarPorId(parseInt(id, 10));

        if (!alternativa) {
            return res.status(404).json({ error: 'Alternativa não encontrada para deletar.' });
        }

        await alternativa.deletar();

        return res.status(200).json({
            message: 'Alternativa deletada com sucesso!',
            deletado: alternativa,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar Alternativa.' });
    }
};
