import { createServer } from 'http';
import { Server } from 'socket.io';
import { Messages } from './lib/users';
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {

  const httpServer = createServer((req, res) => handle(req, res));

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  interface UserMap {
    [username: string]: string; // username -> socketId
  }

  interface MessageQueue {
    [username: string]: Messages[]; // username -> array of messages waiting
  }

  const users: UserMap = {};
  const messageQueue: MessageQueue = {};

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('registerUser', (username: string) => {
      console.log("Registering user:", username);

      // Remove any old mapping for this username
      for (const user in users) {
        if (user === username) {
          delete users[user];
          break;
        }
      }

      // Map new socket
      users[username] = socket.id;

      // Deliver queued messages
      if (messageQueue[username]) {
        messageQueue[username].forEach((message) => {
          socket.emit('receiveMessage', message);
        });
        delete messageQueue[username]; // clear queue after sending
      }

      console.log("Current users:", users);
    });

    socket.on('sendMessage', (message: Messages) => {
      console.log("Message received:", message);

      // Echo back to sender
      io.to(socket.id).emit('receiveMessage', message);

      // Send to recipient if online
      if (users[message.recipient]) {
        io.to(users[message.recipient]).emit('receiveMessage', message);
      } else {
        // Store in queue if offline
        if (!messageQueue[message.recipient]) {
          messageQueue[message.recipient] = [];
        }
        messageQueue[message.recipient].push(message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
        for (const [username, id] of Object.entries(users)) {
        if (id === socket.id) {
          delete users[username];
          console.log(`Removed ${username} from users`);
          break;
        }
      }
    });
  });

  // ✅ Use httpServer instead of server
  httpServer.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
});
