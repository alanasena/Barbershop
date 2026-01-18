RELATORIO DE MODIFICACOES (GIT) E DESCRICAO DO SISTEMA

Este documento resume as modificacoes registradas no Git e explica, em alto nivel, como o sistema funciona.

1) MODIFICACOES REGISTRADAS NO GIT (ULTIMOS COMMITS)

- dfa79b5 (chore: organizar arquivos e ajustes do projeto)
  - Adiciona um .gitignore para evitar arquivos locais e temporarios no repo.
  - Remove arquivos de teste, relatorios locais e scripts auxiliares que nao sao
    necessarios para o funcionamento do projeto.

- 84c5624 (Revert "feat: Implementacao de seguranca, sistema de barbeiros e avaliacoes")
  - Reverte o commit de recursos de barbeiros/avaliacoes e ajustes de seguranca,
    retornando o projeto ao estado anterior a essa adicao.

- e7b3e2c (Revert "feat: painel de barbeiro e ajustes de acesso")
  - Reverte o painel do barbeiro e ajustes de permissao, mantendo o estado antigo.

Observacao: os commits 6b67cda e f01b3b8 aparecem no historico, mas foram
revertidos pelos commits acima. O estado atual da branch master reflete os
reverts.

2) COMO O SISTEMA FUNCIONA (RESUMO)

Frontend (React):
- Interface de login, cadastro, perfil e agendamentos.
- Componentes principais ficam em client/src/components.
- As rotas do frontend apontam para a API do backend.

Backend (Node/Express):
- API REST em server/ com rotas de autenticacao e agendamentos.
- Persistencia em MongoDB via Mongoose.

Fluxo basico:
1. Usuario se cadastra e faz login.
2. O backend valida credenciais e retorna um token.
3. O frontend usa esse token para acessar rotas protegidas.
4. Usuario pode criar e visualizar agendamentos vinculados a sua conta.

Configuracao:
- Variaveis de ambiente devem estar em arquivos .env (nao versionados).
- E necessario configurar a conexao com o MongoDB no backend.

3) OBSERVACOES
- Arquivos locais e testes foram removidos do controle de versao para manter o
  repositorio limpo e garantir apenas o necessario para rodar o projeto.
- Caso queira reintroduzir alguma funcionalidade revertida, ela pode ser
  restaurada via novos commits ou rebase controlado.
