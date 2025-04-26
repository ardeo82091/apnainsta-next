import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Messages } from './lib/users';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

interface UserMap {
  [username: string]: string;
}

interface MessageQueue {
  [username: string]: Messages[];
}

const users: UserMap = {};
const messageQueue: MessageQueue = {};


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('registerUser', (username) => {
    console.log(username);
    if(users) 
    {
      for (const user in users) {
        if (user === username) {
          delete users[user];
          break;
        }
      }
    }
    users[username] = socket.id;
    console.log(messageQueue[username]);
    console.log(users);
    if (messageQueue[username]) {
      messageQueue[username].forEach((message) => {
        socket.emit('receiveMessage', message);
      });
      delete messageQueue[username];1
    }
  });

  socket.on('sendMessage', (message) => {

    io.to(socket.id).emit('receiveMessage', message);
    console.log(users);
    if (users[message.recipient]) {
      console.log(users[message.recipient]);
      io.to(users[message.recipient]).emit('receiveMessage', message);
    } else {
      if (!messageQueue[message.recipient]) {
        messageQueue[message.recipient] = [];
      }
      messageQueue[message.recipient].push(message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
