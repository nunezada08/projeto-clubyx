import AutorModel from '../models/AutorModel.js';
import fs from 'fs';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
        }

        const { id } = req.params;

        if (isNaN(id))
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });

        const autor = await AutorModel.buscarPorId(parseInt(id));
        if (!autor) {
            removerFoto(req.file.path);
            return res.status(404).json({ error: 'Registro do autor não encontrado.' });
        }

        if (autor.foto) {
            await fs.unlink(autor.foto).catch(() => {});
        }

        autor.foto = await processarFoto(req.file.path);
        await autor.atualizar();

        return res.status(201).json({ message: 'Foto salva com sucesso!', foto: autor.foto });
    } catch (error) {
        console.error('Erro ao salvar foto:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro da foto.' });
    }
};

export const verFoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const autor = await AutorModel.buscarPorId(parseInt(id));

        if (!autor) {
            return res.status(404).json({ error: 'Registro do autor não encontrado.' });
        }

        if (!autor.foto) {
            return res.status(404).json({ error: 'Foto do autor não encontrada.' });
        }

        return res.sendFile(autor.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar foto do autor:', error);
        return res.status(500).json({ error: 'Erro ao buscar foto do autor.' });
    }
};
