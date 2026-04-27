import prisma from '../lib/services/prismaClient.js';

export default class AlternativaModel {
    constructor({ id = null, texto, correta = false, questaoId } = {}) {
        this.id = id;
        this.texto = texto;
        this.correta = correta;
        this.questaoId = questaoId;
    }

    async criar() {
        return prisma.alternativa.create({
            data: {
                texto: this.texto,
                correta: this.correta,
                questaoId: this.questaoId,
            },
        });
    }

    async atualizar() {
        return prisma.alternativa.update({
            where: { id: this.id },
            data: {
                texto: this.texto,
                correta: this.correta,
                questaoId: this.questaoId,
            },
        });
    }

    async deletar() {
        return prisma.alternativa.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.texto) {
            where.texto = { contains: filtros.texto, mode: 'insensitive' };
        }

        if (filtros.correta !== undefined) {
            if (filtros.correta === 'true' || filtros.correta === true) {
                where.correta = true;
            }
            if (filtros.correta === 'false' || filtros.correta === false) {
                where.correta = false;
            }
        }

        if (filtros.questaoId !== undefined) {
            const parsedQuestaoId = parseInt(filtros.questaoId, 10);
            if (!Number.isNaN(parsedQuestaoId)) {
                where.questaoId = parsedQuestaoId;
            }
        }

        return prisma.alternativa.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.alternativa.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new AlternativaModel(data);
    }
}
