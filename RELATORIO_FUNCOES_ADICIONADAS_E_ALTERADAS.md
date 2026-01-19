RELATORIO DE FUNCOES ADICIONADAS E ALTERADAS

Este documento descreve as principais funcoes/rotas/componentes adicionadas
ou alteradas e o que elas fazem.

1) BACKEND (API)

- GET /barbers
  - Lista barbeiros para o frontend.
  - Busca usuarios com email @barbearia.com e, se nao existir nenhum, retorna
    todos os usuarios.
  - Arquivo: server/routes/barber.js

- POST /appointment (alterada)
  - Cria agendamento e agora salva barberName e barberEmail junto ao registro.
  - Arquivo: server/routes/appointment.js

- POST /rating
  - Cria avaliacao vinculada a um agendamento.
  - Valida appointmentId, userId e rating, e impede duplicidade.
  - Arquivo: server/routes/rating.js

- POST /rating/manual
  - Cria feedback manual sem necessidade de agendamento.
  - Usado pelo admin para registrar feedbacks diretamente.
  - Arquivo: server/routes/rating.js

- GET /ratings
  - Lista feedbacks ordenados por data.
  - Retorna dados do usuario, agendamento e barbeiro.
  - Arquivo: server/routes/rating.js

2) MODELOS (MONGODB)

- Appointment (alterado)
  - Adicionados campos barberName e barberEmail no agendamento.
  - Arquivo: server/models/Appointment.js

- Rating (adicionado/alterado)
  - Modelo de feedback com suporte a feedback manual.
  - Campos extras: isManual, clientName, clientEmail, barberName, barberEmail.
  - Arquivo: server/models/Rating.js

3) FRONTEND (REACT)

- AdminRoute (alterada)
  - Permite acesso ao painel para admin ou barbeiro.
  - Arquivo: client/src/admin.route.js

- Login (alterada)
  - Identifica barbeiro via email @barbearia.com.
  - Salva cookies de barbeiro (barberName e barberEmail).
  - Arquivo: client/src/components/Login/Login.js

- Appointment (alterada)
  - Busca barbeiros via GET /barbers e permite selecionar no formulario.
  - Envia barberName e barberEmail ao criar ou alterar agendamento.
  - Arquivo: client/src/components/Appointment/Appointment.js

- FeedbacksList (adicionado/alterado)
  - Lista feedbacks com dados de usuario/agendamento/barbeiro.
  - Admin pode criar feedback manual.
  - Barbeiro ve apenas feedbacks relacionados ao seu nome/email.
  - Arquivo: client/src/components/Admin/FeedbacksList/FeedbacksList.js
