require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const setupSocket = require('./socket');

const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim());

const app = express();
app.use(cors({ origin: origins }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/messages'));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: origins } });
setupSocket(io);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => server.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
