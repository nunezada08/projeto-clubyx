import AlunoModel from '../models/AlunoModel.js';
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

        const aluno = await AlunoModel.buscarPorId(parseInt(id));
        if (!aluno) {
            removerFoto(req.file.path);
            return res.status(404).json({ error: 'Registro do aluno não encontrado.' });
        }

        if (aluno.foto) {
            await fs.unlink(aluno.foto).catch(() => {});
        }

        aluno.foto = await processarFoto(req.file.path);
        await aluno.atualizar();

        return res.status(201).json({ message: 'Foto salva com sucesso!', foto: aluno.foto });
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

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Registro do aluno não encontrado.' });
        }

        if (!aluno.foto) {
            return res.status(404).json({ error: 'Foto do aluno não encontrada.' });
        }

        return res.sendFile(aluno.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar foto do aluno:', error);
        return res.status(500).json({ error: 'Erro ao buscar foto do aluno.' });
    }
};
