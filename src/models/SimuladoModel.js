import prisma from '../lib/services/prismaClient.js';

export default class SimuladoModel {
    constructor({ id = null, nome, materia, resumo } = {}) {
        this.id = id;
        this.nome = nome;
        this.materia = materia;
        this.resumo = resumo;
    }

    async criar() {
        return prisma.simulado.create({
            data: {
                nome: this.nome,
                materia: this.materia,
                resumo: this.resumo,
            },
        });
    }

    async atualizar() {
        return prisma.simulado.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                materia: this.materia,
                resumo: this.resumo,
            },
        });
    }

    async deletar() {
        return prisma.simulado.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.materia) {
            where.materia = { contains: filtros.materia, mode: 'insensitive' };
        }
        if (filtros.resumo) {
            where.resumo = { contains: filtros.resumo, mode: 'insensitive' };
        }

        return prisma.simulado.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.simulado.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new SimuladoModel(data);
    }
}
