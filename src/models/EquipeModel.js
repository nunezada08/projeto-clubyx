import prisma from '../lib/services/prismaClient.js';

export default class EquipeModel {
    constructor({ id = null, nome, integrantes = [] } = {}) {
        this.id = id;
        this.nome = nome;
        this.integrantes = integrantes;
    }

    async criar() {
        return prisma.equipe.create({
            data: {
                nome: this.nome,
            },
            include: { integrantes: true },
        });
    }

    async atualizar() {
        return prisma.equipe.update({
            where: { id: this.id },
            data: { nome: this.nome },
            include: { integrantes: true },
        });
    }

    async deletar() {
        return prisma.equipe.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }

        return prisma.equipe.findMany({
            where,
            include: { integrantes: true },
        });
    }

    static async buscarPorId(id) {
        const data = await prisma.equipe.findUnique({
            where: { id },
            include: { integrantes: true },
        });
        if (!data) {
            return null;
        }
        return new EquipeModel(data);
    }
}
