import express from 'express';
import 'dotenv/config';
import livroRoutes from './routes/livroRoutes.js';
import conteudoRoutes from './routes/conteudoRoutes.js'

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas

app.use('/', livroRoutes);
app.use('/', conteudoRoutes);


app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
