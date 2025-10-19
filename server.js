const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/templates', express.static(path.join(__dirname, 'templates')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'templates')));

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
    quantidade INTEGER,
    imagem TEXT,
    categoria TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS lista_desejos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_email TEXT,
    produto_id INTEGER,
    FOREIGN KEY(usuario_email) REFERENCES usuarios(email),
    FOREIGN KEY(produto_id) REFERENCES produtos(id)
  )`);
});

app.get('/api/produtos', (req, res) => {
  const categoria = req.query.categoria;
  if (categoria) {
    db.all('SELECT * FROM produtos WHERE LOWER(categoria) = LOWER(?)', [categoria], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      return res.json(rows);
    });
  } else {
    db.all('SELECT * FROM produtos', [], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      return res.json(rows);
    });
  }
});

app.get('/api/lista_desejos', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email é obrigatório' });
  const sql = `SELECT p.* FROM lista_desejos ld
               JOIN produtos p ON ld.produto_id = p.id
               WHERE ld.usuario_email = ?`;
  db.all(sql, [email], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    return res.json(rows);
  });
});

app.post('/api/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(senha, salt);

  db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Email já cadastrado' });
    }
    res.json({ success: true });
  });
});

app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no servidor. Tente novamente.' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    bcrypt.compare(senha, user.senha, (err, result) => {
      if (result) {
        res.json({ success: true, email: user.email, role: user.role });
      } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
      }
    });
  });
});

app.listen(PORT, () => console.log('🚀 Servidor rodando em http://localhost:' + PORT));
