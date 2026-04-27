import prisma from '../lib/services/prismaClient.js';

export default class SimuladoModel {
    constructor({ id = null, nome, materia, resumo, questoes } = {}) {
        this.id = id;
        this.nome = nome;
        this.materia = materia;
        this.resumo = resumo;
        this.questoes = Array.isArray(questoes) ? questoes : undefined;
    }

    async criar() {
        const data = {
            nome: this.nome,
            materia: this.materia,
            resumo: this.resumo,
        };

        if (this.questoes !== undefined) {
            data.questoes = { create: SimuladoModel.mapQuestoesParaCreate(this.questoes) };
        }

        return prisma.simulado.create({
            data: {
                ...data,
            },
            include: {
                questoes: {
                    include: {
                        alternativas: true,
                    },
                },
            },
        });
    }

    async atualizar() {
        const data = {};

        if (this.nome !== undefined) {
            data.nome = this.nome;
        }

        if (this.materia !== undefined) {
            data.materia = this.materia;
        }

        if (this.resumo !== undefined) {
            data.resumo = this.resumo;
        }

        if (this.questoes !== undefined) {
            data.questoes = {
                deleteMany: {},
                create: SimuladoModel.mapQuestoesParaCreate(this.questoes),
            };
        }

        return prisma.simulado.update({
            where: { id: this.id },
            data,
            include: {
                questoes: {
                    include: {
                        alternativas: true,
                    },
                },
            },
        });
    }

    async deletar() {
        return prisma.$transaction(async (tx) => {
            await tx.alternativa.deleteMany({
                where: {
                    questao: {
                        simuladoId: this.id,
                    },
                },
            });

            await tx.questao.deleteMany({
                where: {
                    simuladoId: this.id,
                },
            });

            return tx.simulado.delete({
                where: { id: this.id },
            });
        });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.materia) {
            where.materia = { contains: filtros.materia, mode: 'insensitive'}
        }
        if (filtros.resumo) {
            where.resumo = { contains: filtros.resumo, mode: 'insensitive' };
        }
       
        return prisma.simulado.findMany({
            where,
            include: {
                questoes: {
                    include: {
                        alternativas: true,
                    },
                },
            },
        });
    }

    static async buscarPorId(id) {
        const data = await prisma.simulado.findUnique({
            where: { id },
            include: {
                questoes: {
                    include: {
                        alternativas: true,
                    },
                },
            },
        });
        if (!data) {
            return null;
        }
        return new SimuladoModel(data);
    }

    static mapQuestoesParaCreate(questoes) {
        if (!Array.isArray(questoes)) {
            return [];
        }

        return questoes
            .filter((questao) => questao && typeof questao.enunciado === 'string' && questao.enunciado.trim() !== '')
            .map((questao) => {
                const questaoData = {
                    enunciado: questao.enunciado,
                };

                if (questao.explicacao !== undefined) {
                    questaoData.explicacao = questao.explicacao;
                }

                if (Array.isArray(questao.alternativas)) {
                    questaoData.alternativas = {
                        create: questao.alternativas
                            .filter((alternativa) => alternativa && typeof alternativa.texto === 'string' && alternativa.texto.trim() !== '')
                            .map((alternativa) => ({
                                texto: alternativa.texto,
                                correta: Boolean(alternativa.correta),
                            })),
                    };
                }

                return questaoData;
            });
    }
}
