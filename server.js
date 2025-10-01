const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/templates', express.static(path.join(__dirname, 'templates')));

const db = new sqlite3.Database(path.join(__dirname, 'loja.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    email TEXT PRIMARY KEY,
    nome TEXT,
    senha TEXT,
    role TEXT DEFAULT 'user'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    descricao TEXT,
    preco REAL,
    quantidade INTEGER
  )`);

  const adminEmail = 'admin@mix-modas.com';
  const adminPass = 'admin123';
  db.get('SELECT email FROM usuarios WHERE email = ?', [adminEmail], (err, row) => {
    if (!row) {
      const h = bcrypt.hashSync(adminPass, 10);
      db.run('INSERT INTO usuarios (email, nome, senha, role) VALUES (?, ?, ?, ?)', [adminEmail, 'Administrador', h, 'admin']);
      console.log('Admin criado:', adminEmail, '/', adminPass);
    }
  });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'tela_login.html')));
app.get('/templates/index.html', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'index.html')));
app.get('/templates/tela_cadastro.html', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'tela_cadastro.html')));

app.post('/api/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'Preencha todos os campos.' });
  const hash = bcrypt.hashSync(senha, 10);
  db.run('INSERT INTO usuarios (email, nome, senha, role) VALUES (?, ?, ?, ?)', [email, nome, hash, 'user'], function(err) {
    if (err) return res.status(400).json({ error: 'Usuário já existe ou erro no cadastro.' });
    res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
  });
});

app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Preencha e-mail e senha.' });
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, row) => {
    if (err || !row) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    const ok = bcrypt.compareSync(senha, row.senha);
    if (!ok) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    res.json({ success: true, role: row.role, email: row.email, nome: row.nome });
  });
});

app.get('/api/produtos', (req, res) => {
  db.all('SELECT * FROM produtos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    res.json(rows);
  });
});

app.post('/api/produtos', (req, res) => {
  const { nome, descricao, preco, quantidade } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  db.run('INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES (?, ?, ?, ?)', [nome, descricao, preco, quantidade], function(err) {
    if (err) return res.status(500).json({ error: 'Erro ao cadastrar' });
    res.json({ success: true, id: this.lastID });
  });
});

app.put('/api/produtos/:id', (req, res) => {
  const id = req.params.id;
  const { nome, descricao, preco, quantidade } = req.body;
  db.run('UPDATE produtos SET nome = ?, descricao = ?, preco = ?, quantidade = ? WHERE id = ?', [nome, descricao, preco, quantidade, id], function(err) {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar' });
    if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ success: true });
  });
});

app.delete('/api/produtos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM produtos WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Erro ao excluir' });
    if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));
