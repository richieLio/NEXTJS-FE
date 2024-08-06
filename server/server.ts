import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:9999", "https://ssbooking.netlify.app", "https://localhost:7183"],
      methods: ["GET", "POST"]
    }
    
  });

  const corsOptions = {
    origin: ["http://localhost:9999", "https://ssbooking.netlify.app", "https://localhost:7183"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  };

  expressApp.use(cors(corsOptions));

  expressApp.use(express.static('public'));

  expressApp.get('*', (req, res) => {
    return handle(req, res);
  });

  io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('join-room', (province) => {
      socket.join(province);
      console.log(`User joined room: ${province}`);
    });

    socket.on('on-chat', (data) => {
      io.to(data.province).emit('user-chat', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  server.listen(4000, () => {
    console.log('listening on port 4000');
  });
  
});
