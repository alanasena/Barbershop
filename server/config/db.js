const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI não está definida no arquivo .env');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    });
    
    console.log(`MongoDB database connection established successfully: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:');
    console.error('Tipo:', err.name);
    console.error('Mensagem:', err.message || 'Sem mensagem de erro');
    
    if (err.name === 'MongooseServerSelectionError') {
      console.error('\n💡 Possíveis causas:');
      console.error('   1. IP não está na whitelist do MongoDB Atlas');
      console.error('   2. Credenciais incorretas (usuário/senha)');
      console.error('   3. Cluster não está acessível');
      console.error('   4. Problema de rede/firewall');
      console.error('\n   Verifique no MongoDB Atlas:');
      console.error('   - Network Access: Adicione seu IP atual');
      console.error('   - Database Access: Verifique usuário e senha');
    }
    
    process.exit(1);
  }
}

module.exports = connectDB
