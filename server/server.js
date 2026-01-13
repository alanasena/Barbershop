const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const authRoute = require('./routes/auth');
const appointmentRoute = require('./routes/appointment');
const profileRoute = require('./routes/profile');
const barberRoute = require('./routes/barber');
const ratingRoute = require('./routes/rating');

const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config()

const app = express();

// Configurar CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/', authRoute);
app.use('/', appointmentRoute);
app.use('/', profileRoute);
app.use('/api', barberRoute);  // Mudança: usar /api como prefixo
app.use('/api', ratingRoute);  // Mudança: usar /api como prefixo

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Aguardar conexão com o banco antes de iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () =>
      console.log(`Server has started on port: ${PORT}`)
    );
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();