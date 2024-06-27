const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000; // Porta em que o servidor irá rodar

app.use(cors()); // Adiciona middleware CORS

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Serve o db.json
app.use('/db', express.static(path.join(__dirname, 'db')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/repo.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'repo.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
