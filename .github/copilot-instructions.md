## Instruções rápidas para agentes de IA — repositório Avalia-o

Objetivo: ajudar um agente a ser produtivo rapidamente neste projeto Node/Express simples com SQLite e front-end estático.

- Ponto de entrada: `server.js` — servidor Express único que serve as páginas em `templates/`, ativos estáticos em `static/` e expõe a API REST em `/api/*`.
- Banco: arquivo SQLite (`loja.db`) criado automaticamente na raiz. As tabelas principais são `usuarios` e `produtos` (veja DDL em `server.js`).

- Autenticação/roles:
  - Não há JWT persistente. O backend usa senhas com `bcryptjs` para usuários reais.
  - Para rotas administrativas (`POST/PUT/DELETE /api/produtos`) a checagem é feita via header `role` enviado pelo frontend (valor esperado: `admin`).
  - O servidor cria um usuário admin por padrão: `admin@mix-modas.com` / `admin123` (veja `server.js`).

- Uploads e arquivos:
  - Uploads são gerenciados por `multer`, diretório `uploads/`. O campo de formulário de imagem é `imagem`.
  - Rotas públicas servem `/static`, `/templates` e `/uploads`.

- Fluxos e exemplos de API (úteis para gerar testes ou solicitações):
  - Cadastro: POST `/api/cadastro` body JSON/FORM com `nome`, `email`, `senha` → cria usuário (hash com bcrypt).
  - Login: POST `/api/login` com `email`, `senha` → retorna `{ success, role, email, nome }` quando válido.
  - Listar produtos: GET `/api/produtos` → array de produtos.
  - Criar produto: POST `/api/produtos` (header `role: admin`, multipart form com `imagem` e campos `nome, descricao, preco, quantidade`).

- Testes e código de teste:
  - `package.json` tem scripts: `npm start` (inicia `server.js`) e `npm test` (executa `jest`).
  - A pasta `src/services/authService.js` e `src/models/user.js` são implementações simples/mocked usadas pelos testes (compare com `server.js` que usa sqlite direto). Tests esperam comportamento síncrono/mock (p.ex. `AuthService.login` retorna token mockado).

- Convenções e decisões de arquitetura observáveis:
  - Projeto é híbrido: servidor monolítico Express + front-end estático (no repositório). Não há separação por microserviços.
  - Lógica de persistência está duplicada em camadas: a API real usa `sqlite3` em `server.js`, enquanto testes unitários usam classes mock em `src/models`.
  - Simplicidade preferida sobre segurança/escala: roles via header, frete simulado com valor randômico.

- O que um agente de IA pode fazer aqui (prioridade):
  1. Implementar/ajustar endpoints seguindo o estilo do `server.js` (callbacks sqlite + respostas JSON).
  2. Atualizar front-end estático para usar os campos corretos (`role` header ao chamar rotas admin, nome do campo `imagem` em forms multipart).
  3. Adicionar testes Jest cobrindo endpoints usando `supertest` (o projeto já usa Jest). Para testes de integração, mockar o DB ou usar um arquivo SQLite temporário.

- Pontos a evitar ou observar com cuidado:
  - Não substitua o comportamento de hash de senha do `server.js` por mocks sem ajustar a base de dados: o servidor espera senhas hasheadas para logins reais.
  - Ao alterar a verificação de admin, atualize todas as chamadas de front-end em `static/js/*.js` que definem o header `role`.

- Arquivos-chave a inspecionar para mudanças/integração:
  - `server.js` — lógica central (rotas, DB, multer, criação do admin).
  - `src/services/authService.js` — implementação de serviço usado nos testes (mock-friendly).
  - `src/models/user.js` — mock do repositório de usuários para testes unitários.
  - `static/js/*.js` e `templates/*` — interações frontend → endpoints.
  - `package.json` — scripts e dependências.

Se algo aqui estiver incompleto ou você quer que eu amplie com exemplos de requests (curl/PowerShell) ou trechos de testes Jest específicos — diga o que prefere e eu atualizo o arquivo.
