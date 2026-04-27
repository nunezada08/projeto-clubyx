import prisma from '../lib/services/prismaClient.js';

export default class IntegranteModel {
    constructor({ id = null, nome, curso, foto, equipeId } = {}) {
        this.id = id;
        this.nome = nome;
        this.curso = curso;
        this.foto = foto;
        this.equipeId = equipeId;
    }

    async criar() {
        return prisma.integrante.create({
            data: {
                nome: this.nome,
                curso: this.curso,
                foto: this.foto,
                equipeId: this.equipeId,
            },
        });
    }

    async atualizar() {
        return prisma.integrante.update({
            where: { id: this.id },
            data: { nome: this.nome, curso: this.curso, foto: this.foto, equipeId: this.equipeId },
        });
    }

    async deletar() {
        return prisma.integrante.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.curso) {
            where.curso = { contains: filtros.curso, mode: 'insensitive'}
        }
        if (filtros.foto) {
            where.foto = { contains: filtros.foto, mode: 'insensitive' };
        }
        if (filtros.equipeId !== undefined) {
            const parsedEquipeId = parseInt(filtros.equipeId, 10);
            if (!Number.isNaN(parsedEquipeId)) {
                where.equipeId = parsedEquipeId;
            }
        }
        return prisma.integrante.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.integrante.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new IntegranteModel(data);
    }
}
