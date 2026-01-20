RELATORIO DE FUNCOES ADICIONADAS E ALTERADAS

Este documento descreve as principais funcoes/rotas/componentes adicionadas
ou alteradas e o que elas fazem.

1) BACKEND (API)

- GET /barbers
  - Lista barbeiros para o frontend.
  - Busca usuarios com email @barbearia.com e, se nao existir nenhum, retorna
    todos os usuarios.
  - Rota: GET /barbers
  - Caminho do arquivo: server/routes/barber.js
  Codigo:
  ```js
  router.get('/barbers', async (req, res) => {
      let barbers = await Users.find({ email: /@barbearia\.com$/i })
          .select('name email')
          .sort({ name: 1 })
      if (!barbers.length) {
          barbers = await Users.find().select('name email').sort({ name: 1 })
      }
      res.send(barbers.map((barber) => ({
          id: barber._id, name: barber.name, email: barber.email
      })))
  })
  ```

- POST /appointment (alterada)
  - Cria agendamento e agora salva barberName e barberEmail junto ao registro.
  - Rota: POST /appointment
  - Caminho do arquivo: server/routes/appointment.js
  Codigo:
  ```js
  let { userID, key, name, date, time, phone, day, timeInMS, barberName, barberEmail } = req.body
  const newAppointment = new NewAppointment({
      userID,
      appointmentKey: key,
      name,
      date,
      time,
      phone,
      day,
      timeInMS,
      barberName,
      barberEmail
  })
  ```

- POST /rating
  - Cria avaliacao vinculada a um agendamento.
  - Valida appointmentId, userId e rating, e impede duplicidade.
  - Rota: POST /rating
  - Caminho do arquivo: server/routes/rating.js
  Codigo:
  ```js
  const { appointmentId, userId, rating, comment } = req.body
  const existingRating = await Rating.findOne({ appointmentId })
  if (existingRating) {
      return res.status(400).send({ error: 'Este agendamento ja foi avaliado' })
  }
  const newRating = new Rating({
      appointmentId,
      userId,
      rating,
      comment: comment || '',
      isManual: false
  })
  await newRating.save()
  ```

- POST /rating/manual
  - Cria feedback manual sem necessidade de agendamento.
  - Usado pelo admin para registrar feedbacks diretamente.
  - Rota: POST /rating/manual
  - Caminho do arquivo: server/routes/rating.js
  Codigo:
  ```js
  const { rating, comment, clientName, clientEmail, barberName, barberEmail } = req.body
  const manualRating = new Rating({
      rating,
      comment: comment || '',
      isManual: true,
      clientName: clientName || 'Cliente',
      clientEmail: clientEmail || '',
      barberName,
      barberEmail: barberEmail || ''
  })
  await manualRating.save()
  ```

- GET /ratings
  - Lista feedbacks ordenados por data.
  - Retorna dados do usuario, agendamento e barbeiro.
  - Rota: GET /ratings
  - Caminho do arquivo: server/routes/rating.js
  Codigo:
  ```js
  const ratings = await Rating.find()
      .sort({ createdAt: -1 })
      .populate('appointmentId')
      .populate('userId')
  const response = ratings.map((item) => ({
      rating: item.rating,
      comment: item.comment,
      barberName: item.barberName || null,
      barberEmail: item.barberEmail || null
  }))
  res.send(response)
  ```

2) MODELOS (MONGODB)

- Appointment (alterado)
  - Adicionados campos barberName e barberEmail no agendamento.
  - Caminho do arquivo: server/models/Appointment.js
  Codigo:
  ```js
  barberName: {
      type: String,
      trim: true
  },
  barberEmail: {
      type: String,
      trim: true,
      lowercase: true
  }
  ```

- Rating (adicionado/alterado)
  - Modelo de feedback com suporte a feedback manual.
  - Campos extras: isManual, clientName, clientEmail, barberName, barberEmail.
  - Caminho do arquivo: server/models/Rating.js
  Codigo:
  ```js
  isManual: {
      type: Boolean,
      default: false
  },
  clientName: {
      type: String,
      trim: true,
      maxlength: 120
  },
  barberName: {
      type: String,
      trim: true,
      maxlength: 120
  },
  barberEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 120
  }
  ```

3) FRONTEND (REACT)

- AdminRoute (alterada)
  - Permite acesso ao painel para admin ou barbeiro.
  - Caminho do arquivo: client/src/admin.route.js
  Codigo:
  ```js
  if (getCookie('admin') === 'true' || getCookie('barber') === 'true') {
      return <Components {...props} />;
  }
  return <Redirect from={`${props.location}`} to='/appointment'/>;
  ```

- Login (alterada)
  - Identifica barbeiro via email @barbearia.com.
  - Salva cookies de barbeiro (barberName e barberEmail).
  - Caminho do arquivo: client/src/components/Login/Login.js
  Codigo:
  ```js
  const isBarber = email.toLowerCase().includes('@barbearia.com')
  setCookie('barber', isBarber ? 'true' : 'false', 2)
  if (isBarber) {
      const response = await axios.get(`${API_URL}/barbers`)
      const list = Array.isArray(response.data) ? response.data : []
      const barber = list.find((item) => item.email === email)
      setCookie('barberName', barber ? barber.name : name, 2)
      setCookie('barberEmail', barber ? barber.email : email, 2)
  }
  ```

- Appointment (alterada)
  - Busca barbeiros via GET /barbers e permite selecionar no formulario.
  - Envia barberName e barberEmail ao criar ou alterar agendamento.
  - Caminho do arquivo: client/src/components/Appointment/Appointment.js
  Codigo:
  ```js
  const response = await axios.get(`${API_URL}/barbers`)
  const list = Array.isArray(response.data) ? response.data : []
  setBarbers(list)
  ...
  appointmentData.barberName = selectedBarberName
  appointmentData.barberEmail = selectedBarberEmail
  ```

- FeedbacksList (adicionado/alterado)
  - Lista feedbacks com dados de usuario/agendamento/barbeiro.
  - Admin pode criar feedback manual.
  - Barbeiro ve apenas feedbacks relacionados ao seu nome/email.
  - Caminho do arquivo: client/src/components/Admin/FeedbacksList/FeedbacksList.js
  Codigo:
  ```js
  const response = await axios.get(`${API_URL}/ratings`)
  setFeedbacks(response.data || [])
  ...
  const payload = {
      rating: Number(newRating),
      comment: newComment,
      clientName: newClientName,
      clientEmail: newClientEmail,
      barberName: newBarberName,
      barberEmail: newBarberEmail
  }
  await axios.post(`${API_URL}/rating/manual`, payload)
  ...
  const filtered = feedbacks.filter((item) => {
      const barberEmail = (getCookie('barberEmail') || getCookie('email') || '').toLowerCase()
      const itemEmail = (item.barberEmail || '').toLowerCase()
      return barberEmail && itemEmail && itemEmail === barberEmail
  })
  ```
