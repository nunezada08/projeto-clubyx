import ConteudoModel from '../models/ConteudoModel.js';


export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { materia, resumo, dicas, analises, curiosidades, videoAulas } = req.body;

        if (!materia){
            return res.status(400).json({ error: 'O campo "materia" é obrigatório!' });
        }
        if (!resumo){
            return res.status(400).json({ error: 'O campo "resumo" é obrigatório!' });
        }
        if (!dicas){
            return res.status(400).json({ error: 'O campo "dicas" é obrigatório!' });
        }
        if (!analises) {
            return res.status(400).json({ error: 'O campo "analises" é obrigatório!' });
        }
        if (!curiosidades) {
            return res.status(400).json({ error: 'O campo "curiosidades" é obrigatório!' });
        }
        if (!videoAulas) {
            return res.status(400).json({ error: 'O campo "videoAulas" é obrigatório!' });
        }


        const conteudo = new ConteudoModel({ materia, resumo, dicas, analises, curiosidades, videoAulas});
        const data = await conteudo.criar();

        return res.status(201).json({ message: 'Conteudo inserido com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o Conteudo.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await ConteudoModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum Conteudo encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar Conteudos.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const conteudo = await ConteudoModel.buscarPorId(parseInt(id));

        if (!conteudo) {
            return res.status(404).json({ error: 'Conteudo não encontrado.' });
        }

        return res.status(200).json({ data: conteudo });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar conteudo.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const conteudo = await ConteudoModel.buscarPorId(parseInt(id));

        if (!conteudo) {
            return res.status(404).json({ error: 'Conteudo não encontrado para atualizar.' });
        }

        if (req.body.materia !== undefined) {
            conteudo.materia = req.body.materia;
        }
        if (req.body.resumo !== undefined) {
            conteudo.resumo = req.body.resumo;
        }
        if (req.body.dicas !== undefined) {
            conteudo.dicas = req.body.dicas;
        }
        if (req.body.analises !== undefined) {
            conteudo.analises = req.body.analises;
        }
        if (req.body.curiosidades !== undefined) {
            conteudo.curiosidades = req.body.curiosidades;
        }
        if (req.body.videoAulas !== undefined) {
            conteudo.videoAulas = req.body.videoAulas;
        }

        const data = await conteudo.atualizar();

        return res.status(200).json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const conteudo = await ConteudoModel.buscarPorId(parseInt(id));

        if (!conteudo) {
            return res.status(404).json({ error: 'Conteudo não encontrado para deletar.' });
        }

        await conteudo.deletar();

        return res.status(200).json({ message: `O registro "${conteudo.nome}" foi deletado com sucesso!`, deletado: conteudo });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
