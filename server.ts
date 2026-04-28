import { createServer } from "http";
import { Server } from "socket.io";
import { Messages } from "./lib/users";
import mongoose from "mongoose";
import Chat from "./models/Chat";
import Message from "./models/Message";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("MongoDB connected");

  const httpServer = createServer((req, res) => handle(req, res));

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  interface UserMap {
    [userName: string]: string;
  }

  interface MessageQueue {
    [userName: string]: Messages[];
  }

  const users: UserMap = {};
  const messageQueue: MessageQueue = {};

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // REGISTER USER
    socket.on("registerUser", (userName: string) => {
      console.log("Registering user:", userName);

      // remove old mapping
      for (const user in users) {
        if (user === userName) {
          delete users[user];
          break;
        }
      }

      users[userName] = socket.id;

      // deliver queued messages
      if (messageQueue[userName]) {
        messageQueue[userName].forEach((message) => {
          socket.emit("receiveMessage", message);
        });
        delete messageQueue[userName];
      }

      console.log("Current users:", users);
    });

    // SEND MESSAGE
    socket.on("sendMessage", async (message: Messages & { recipient?: string }) => {
      try {
        const { sender, chatId, content, type, recipient } = message;

        let chat;

        if (chatId) {
          chat = await Chat.findById(chatId);
        }

        if (!chat) {
          if (!recipient) return;

          chat = await Chat.create({
            participants: [sender, recipient],
          });
        }

        // SAVE MESSAGE
        const savedMessage = await Message.create({
          chatId: chat._id,
          sender,
          content,
          type: type || "text",
          readBy: [sender],
          createdAt: new Date(),
        });

        // UPDATE CHAT
        chat.lastMessage = {
          text: content,
          sender,
          timestamp: savedMessage.createdAt,
        };

        chat.updatedAt = new Date();
        await chat.save();

        // SEND TO SENDER
        io.to(socket.id).emit("receiveMessage", savedMessage);

        // SEND TO RECEIVER
        chat.participants.forEach((userId: string) => {
          if (userId !== sender) {
            if (users[userId]) {
              io.to(users[userId]).emit("receiveMessage", savedMessage);
            } else {
              if (!messageQueue[userId]) {
                messageQueue[userId] = [];
              }
              messageQueue[userId].push(savedMessage);
            }
          }
        });
      } catch (error) {
        console.error("sendMessage error:", error);
      }
    });

    // MARK AS READ
    socket.on("markAsRead", async ({ chatId, userName }) => {
      try {
        await Message.updateMany(
          {
            chatId,
            sender: { $ne: userName },
          },
          {
            $addToSet: { readBy: userName },
          }
        );

        const chat = await Chat.findById(chatId);
        if (!chat) return;

        // notify others
        chat.participants.forEach((participant: string) => {
          if (participant !== userName && users[participant]) {
            io.to(users[participant]).emit("messagesRead", {
              chatId,
              userName,
            });
          }
        });
      } catch (error) {
        console.error("markAsRead error:", error);
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (const [userName, id] of Object.entries(users)) {
        if (id === socket.id) {
          delete users[userName];
          console.log(`Removed ${userName} from users`);
          break;
        }
      }
    });
  });

  httpServer.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
});