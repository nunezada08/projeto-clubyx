import pg from 'pg';
import 'dotenv/config';
import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed...');

    // ─── Limpeza (ordem importa por causa das FK) ───────────────────────
    await prisma.alternativa.deleteMany();
    await prisma.questao.deleteMany();
    await prisma.simulado.deleteMany();
    await prisma.conteudo.deleteMany();
    await prisma.livro.deleteMany();
    await prisma.autor.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.integrante.deleteMany();
    await prisma.equipe.deleteMany();

    console.log('🗑️  Tabelas limpas.');

    // ─── Equipe & Integrantes ────────────────────────────────────────────
    const equipe = await prisma.equipe.create({
        data: {
            nome: 'Clubyx',
            integrantes: {
                create: [
                    { nome: 'Vitor Nunes', curso: 'Desenvolvimento de Sistemas' },
                    { nome: 'Jhonatan Favoreto', curso: 'Desenvolvimento de Sistemas' },
                    { nome: 'Henrico Ferrari', curso: 'Desenvolvimento de Sistemas' },
                    { nome: 'Lucas Bento', curso: 'Desenvolvimento de Sistemas' },
                    { nome: 'Ana Julia Ramos', curso: 'Desenvolvimento de Sistemas' },
                    { nome: 'Julia Anjos', curso: 'Desenvolvimento de Sistemas' },
                    { nome: 'Enzo Velluchi', curso: 'Mecanica' },
                    { nome: 'Miguel fontenelli', curso: 'Mecanica' },
                    { nome: 'Renan Santos', curso: 'Eletrica' },
                    { nome: 'Guilherme Henrique', curso: 'Eletrica' },
                ],
            },
        },
    });
    console.log(`✅ Equipe criada: ${equipe.nome}`);

    // ─── Usuários ────────────────────────────────────────────────────────
    await prisma.usuario.createMany({
        data: [
            {
                nome: 'João Pedro Piva',
                email: 'joaopedropiva17@gmail.com',
                senha: 'jppn1028',
                numeroTelefone: '(19) 99339-1977',
            },
            {
                nome: 'Maria Fernanda',
                email: 'maria@gmail.com',
                senha: 'hashed_senha_maria',
                numeroTelefone: '(11) 98888-0002',
            },
        ],
    });
    console.log('✅ Usuários criados.');

    // ─── Autor ───────────────────────────────────────────────────────────
    const autor = await prisma.autor.create({
        data: {
            nome: 'Machado de Assis',
            biografiaAutor: `Joaquim Maria Machado de Assis nasceu no Rio de Janeiro em 1839.
Considerado o maior nome da literatura brasileira, fundou a Academia Brasileira de Letras
em 1897 e foi seu primeiro presidente. Escreveu em praticamente todos os gêneros literários,
destacando-se nos romances da fase realista, nos contos e na crônica.`,
            dataNascimento: new Date('1839-06-21'),
            dataMorte: new Date('1908-09-29'),
        },
    });
    console.log(`✅ Autor criado: ${autor.nome}`);

    // ─── Livro ───────────────────────────────────────────────────────────
    const livro = await prisma.livro.create({
        data: {
            nome: 'Memórias Póstumas de Brás Cubas',
            resumo: `Narrado pelo próprio defunto-autor Brás Cubas, o romance conta a trajetória
de um rico herdeiro fluminense que, após a morte, decide escrever suas memórias.
Com ironia e humor corrosivo, Brás relata seus amores — especialmente o caso com
Virgília, mulher casada —, suas ambições frustradas, sua mediocridade disfarçada
de grandeza e sua incapacidade de realizar qualquer coisa verdadeiramente útil.
A obra inaugura o Realismo no Brasil e quebra todas as convenções do romance romântico.`,
            personagens: `Brás Cubas (narrador-defunto e protagonista), Virgília (amante apaixonada),
Marcela (cortesã espanhola), Lobo Neves (marido de Virgília), Quincas Borba (filósofo do Humanitismo),
Eugênia (a "flor da moita"), Nhã-loló (noiva frustrada), Cotrim (cunhado severo).`,
            contextoHist: `Publicado originalmente em folhetins na Revista Brasileira entre 1880 e 1881,
e em livro em 1881. Situa-se no Brasil do século XIX, no Rio de Janeiro imperial,
retratando a aristocracia escravocrata, os jogos políticos do Segundo Reinado
e os costumes da elite carioca da época.`,
            publicacao: '1881',
            autorId: autor.id,
        },
    });
    console.log(`✅ Livro criado: ${livro.nome}`);

    // ─── Conteúdo ────────────────────────────────────────────────────────
    await prisma.conteudo.create({
        data: {
            materia: 'Literatura Brasileira — Realismo',
            resumo: `O Realismo brasileiro surge em 1881 com "Memórias Póstumas de Brás Cubas".
Reage ao idealismo romântico, propondo uma visão crítica, objetiva e pessimista da realidade.
Características centrais: crítica social, análise psicológica profunda, ironia, linguagem seca e precisa.`,
            dicas: `1. Identifique a metalinguagem: o narrador comenta o próprio ato de narrar.
2. Observe as digressões — cada desvio do enredo tem um propósito crítico.
3. Relacione o Humanitismo de Quincas Borba ao darwinismo social do século XIX.
4. Compare com o Romantismo anterior: perceba o que Machado está rejeitando.
5. Anote as referências a Stendhal, Sterne e Xavier de Maistre citadas pelo autor.`,
            analises: `A narrativa em primeira pessoa post-mortem libera Brás Cubas de qualquer
constrangimento social: ele pode ser honesto sobre sua desonestidade.
A estrutura fragmentada dos capítulos curtos (alguns com poucas linhas) reflete
a descontinuidade da memória e antecipa técnicas modernistas.
O "epicurismo da dor" expresso no último capítulo — o saldo negativo de uma vida
sem filhos e sem legado — é o coração filosófico da obra.`,
            curiosidades: `• É o único romance narrado por um defunto na literatura ocidental do século XIX.
- O capítulo 1 se chama "Ao Leitor" e o capítulo 160 "Das Negativas" — inversão proposital.
- Machado sofria de epilepsia; alguns críticos veem o delírio do hipopótamo como referência à doença.
- A dedicatória é irônica: "Ao verme que primeiro roeu as frias carnes do meu cadáver".
- Foi o primeiro livro brasileiro a usar o fluxo de consciência de forma sistemática.`,
            videoAulas: `https://www.youtube.com/watch?v=exemplo1 | Introdução ao Realismo Brasileiro
https://www.youtube.com/watch?v=exemplo2 | Análise completa de Memórias Póstumas
https://www.youtube.com/watch?v=exemplo3 | Machado de Assis: vida e obra`,
        },
    });
    console.log('✅ Conteúdo criado.');

    // ─── Simulado, Questões e Alternativas ──────────────────────────────
    const simulado = await prisma.simulado.create({
        data: {
            nome: 'Simulado — Memórias Póstumas de Brás Cubas',
            materia: 'Literatura Brasileira',
            resumo: 'Questões sobre enredo, personagens, contexto histórico e características do Realismo presentes na obra de Machado de Assis.',
        },
    });

    const questoesData = [
        {
            enunciado: 'Quem narra "Memórias Póstumas de Brás Cubas"?',
            explicacao:
                'A obra é narrada pelo próprio Brás Cubas após sua morte, recurso chamado de "defunto-autor", inovação radical de Machado de Assis.',
            alternativas: [
                { texto: 'Um narrador onisciente em terceira pessoa', correta: false },
                { texto: 'O próprio Brás Cubas, já falecido', correta: true },
                { texto: 'Virgília, amante de Brás Cubas', correta: false },
                { texto: 'Quincas Borba, amigo filósofo do protagonista', correta: false },
            ],
        },
        {
            enunciado:
                'Qual movimento literário brasileiro é inaugurado com a publicação da obra em 1881?',
            explicacao:
                'Memórias Póstumas de Brás Cubas é considerado o marco inicial do Realismo no Brasil, rompendo com o Romantismo vigente.',
            alternativas: [
                { texto: 'Romantismo', correta: false },
                { texto: 'Modernismo', correta: false },
                { texto: 'Realismo', correta: true },
                { texto: 'Naturalismo', correta: false },
            ],
        },
        {
            enunciado: 'Como se chama a filosofia criada por Quincas Borba dentro do romance?',
            explicacao:
                'O Humanitismo é uma filosofia fictícia e satírica criada por Machado para criticar o darwinismo social e o utilitarismo do século XIX.',
            alternativas: [
                { texto: 'Positivismo', correta: false },
                { texto: 'Humanitismo', correta: true },
                { texto: 'Espiritualismo', correta: false },
                { texto: 'Empirismo', correta: false },
            ],
        },
        {
            enunciado: 'Qual é o tom predominante da narrativa de Brás Cubas?',
            explicacao:
                'Machado utiliza a ironia como principal recurso estilístico, expondo as contradições e a hipocrisia da sociedade burguesa brasileira do século XIX.',
            alternativas: [
                { texto: 'Lírico e sentimental', correta: false },
                { texto: 'Épico e heroico', correta: false },
                { texto: 'Irônico e pessimista', correta: true },
                { texto: 'Ingênuo e otimista', correta: false },
            ],
        },
        {
            enunciado: 'Qual é o saldo final que Brás Cubas apresenta no último capítulo da obra?',
            explicacao:
                'No capítulo "Das Negativas", Brás conclui que seu saldo é negativo: não transmitiu a nenhuma criatura o legado de nossa miséria — não teve filhos.',
            alternativas: [
                { texto: 'Positivo: acumulou riqueza e prestígio', correta: false },
                { texto: 'Neutro: viveu uma vida comum sem grandes feitos', correta: false },
                { texto: 'Negativo: não deixou herdeiros nem legado útil', correta: true },
                { texto: 'Positivo: encontrou o amor verdadeiro', correta: false },
            ],
        },
    ];

    for (const q of questoesData) {
        await prisma.questao.create({
            data: {
                enunciado: q.enunciado,
                explicacao: q.explicacao,
                simuladoId: simulado.id,
                alternativas: {
                    create: q.alternativas,
                },
            },
        });
    }
    console.log(`✅ Simulado criado com ${questoesData.length} questões.`);

    console.log('\n🎉 Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
