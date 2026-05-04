import prisma from '../lib/services/prismaClient.js';

export default class ConteudoModel {
    constructor({ id = null, materia, resumo, dicas, analises, curiosidades, videoAulas } = {}) {
        this.id = id;
        this.materia = materia;
        this.resumo = resumo;
        this.dicas = dicas;
        this.analises = analises;
        this.curiosidades = curiosidades;
        this.videoAulas = videoAulas;
    }

    async criar() {
        return prisma.conteudo.create({
            data: {
                materia: this.materia,
                resumo: this.resumo,
                dicas: this.dicas,
                analises: this.analises,
                curiosidades: this.curiosidades,
                videoAulas: this.videoAulas,
            },
        });
    }

    async atualizar() {
        return prisma.conteudo.update({
            where: { id: this.id },
            data: {
                materia: this.materia,
                resumo: this.resumo,
                dicas: this.dicas,
                analises: this.analises,
                curiosidades: this.curiosidades,
                videoAulas: this.videoAulas,
            },
        });
    }

    async deletar() {
        return prisma.conteudo.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.materia) {
            where.materia = { contains: filtros.materia, mode: 'insensitive' };
        }
        if (filtros.resumo) {
            where.resumo = { contains: filtros.resumo, mode: 'insensitive' };
        }
        if (filtros.dicas) {
            where.dicas = { contains: filtros.dicas, mode: 'insensitive' };
        }
        if (filtros.analises) {
            where.analises = { contains: filtros.analises, mode: 'insensitive' };
        }
        if (filtros.curiosidades) {
            where.curiosidades = { contains: filtros.curiosidades, mode: 'insensitive' };
        }
        if (filtros.videoAulas) {
            where.videoAulas = { contains: filtros.videoAulas, mode: 'insensitive' };
        }

        return prisma.conteudo.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.conteudo.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new ConteudoModel(data);
    }
}
