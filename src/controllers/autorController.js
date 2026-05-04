import AutorModel from '../models/AutorModel.js';


export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, biografiaAutor, dataNascimento, dataMorte } = req.body;

        if (!nome){
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }
        if (!biografiaAutor){
            return res.status(400).json({ error: 'O campo "biografiaAutor" é obrigatório!' });
        }
        if (!dataNascimento){
            return res.status(400).json({ error: 'O campo "dataNascimento" é obrigatório!' });
        }


        const autor = new AutorModel({ nome, biografiaAutor, dataNascimento, dataMorte });
        const data = await autor.criar();

        return res.status(201).json({ message: 'Autor criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o autor.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await AutorModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
           return res.status(404).json({ message: 'Nenhum autor encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar autor.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const autor = await AutorModel.buscarPorId(parseInt(id));

        if (!autor) {
            return res.status(404).json({ error: 'Autor não encontrado.' });
        }

        return res.status(200).json({ data: autor });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar autor.' });
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

        const autor = await AutorModel.buscarPorId(parseInt(id));

        if (!autor) {
            return res.status(404).json({ error: 'Autor não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            autor.nome = req.body.nome;
        }
        if (req.body.biografiaAutor !== undefined) {
            autor.biografiaAutor = req.body.biografiaAutor;
        }
        if (req.body.dataNascimento !== undefined) {
            autor.dataNascimento = req.body.dataNascimento;
        }
        if (req.body.dataMorte !== undefined) {
            autor.dataMorte = req.body.dataMorte;
        }

        const data = await autor.atualizar();

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

        const autor = await AutorModel.buscarPorId(parseInt(id));

        if (!autor) {
            return res.status(404).json({ error: 'Autor não encontrado para deletar.' });
        }

        await autor.deletar();

        return res.status(200).json({ message: `O registro "${autor.nome}" foi deletado com sucesso!`, deletado: autor });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
