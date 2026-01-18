RELATORIO DE MODIFICACOES NO SISTEMA E DESCRICAO DE FUNCIONAMENTO

Este documento informa as modificacoes realizadas no sistema e resume o
funcionamento atual.

1) MODIFICACOES REALIZADAS NO SISTEMA (ESTADO ATUAL)

- Organizacao do repositorio:
  - Adicionado .gitignore para evitar arquivos locais e temporarios no Git.
  - Removidos scripts de teste, relatorios locais e arquivos auxiliares que nao
    sao necessarios para executar o sistema.

- Ajustes de codigo sem impacto funcional:
  - Normalizacao de formato/linha em alguns arquivos do backend (sem alterar
    regras de negocio).

- Feedbacks (avaliacoes) reintroduzidos:
  - Criado modelo e rotas para registrar e listar avaliacoes.
  - Adicionada tela de visualizacao no painel de controle (admin).

Onde foram feitas as modificacoes (arquivos):
- `.gitignore` (novo): regras para ignorar arquivos locais/temporarios.
- `server/config/db.js`: ajustes de formatacao (sem mudanca de logica).
- `server/models/Appointment.js`: ajustes de formatacao (sem mudanca de logica).
- `server/routes/auth.js`: ajustes de formatacao (sem mudanca de logica).
- `server/server.js`: ajustes de formatacao (sem mudanca de logica).
- `server/models/Rating.js`: modelo de avaliacao (feedback).
- `server/routes/rating.js`: rotas para criar e listar feedbacks.
- `client/src/components/Admin/FeedbacksList/`:
  - `FeedbacksList.js` e `FeedbacksList.css` (tela de feedbacks).
- `client/src/components/Tabs/Tabs.js`: nova aba "Feedbacks" no painel.

2) MODIFICACOES FEITAS E POSTERIORMENTE REVERTIDAS

Obs.: Estas mudancas foram implementadas no passado e depois revertidas na
branch master, portanto nao estao ativas no sistema atual.

- Painel e acessos de barbeiro (permissoes e rotas dedicadas).
- Sistema de barbeiros e avaliacoes (cadastro, selecao e avaliacao).
- Ajustes de seguranca relacionados ao fluxo acima.

3) COMO O SISTEMA FUNCIONA (RESUMO)

Frontend (React):
- Telas de login, cadastro, perfil e agendamentos.
- Componentes ficam em client/src/components.
- O frontend consome a API do backend.

Onde fica no codigo (frontend):
- Rotas principais em `client/src/App.js`.
- Telas principais em `client/src/components/`.

Backend (Node/Express):
- API REST em server/ com rotas de autenticacao e agendamentos.
- Persistencia em MongoDB via Mongoose.

Onde fica no codigo (backend):
- Servidor e middlewares em `server/server.js`.
- Conexao com o banco em `server/config/db.js`.
- Rotas em `server/routes/`.
- Modelos (schemas) em `server/models/`.

Fluxo basico:
1. Usuario se cadastra e faz login.
2. O backend valida credenciais e retorna um token.
3. O frontend usa esse token para acessar rotas protegidas.
4. Usuario cria e visualiza agendamentos vinculados a sua conta.

Configuracao:
- Variaveis de ambiente ficam em arquivos .env (nao versionados).
- E necessario configurar a conexao com o MongoDB no backend.

4) COMO VER O FEEDBACK (AVALIACOES)

Como acessar na interface:
1. Fazer login como admin.
2. Acessar o Painel de Controle.
3. Abrir a aba "Feedbacks" para ver a lista de avaliacoes.

Rotas e dados:
- Listagem: `GET /ratings` (retorna usuario, agendamento, nota e comentario).
- Criacao: `POST /rating` com `appointmentId`, `userId`, `rating`, `comment`.
