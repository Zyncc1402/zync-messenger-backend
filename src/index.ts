import http from "http";
import { Server } from "socket.io";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    allowedHeaders: "*",
  },
});

type message = { message: string; formattedTime: string };

io.on("connection", (socket) => {
  console.log("NewConnection", socket.id.substring(0, 7));
  socket.on("join-room", (room: string) => {
    console.log(`${socket.id.substring(0, 7)} joined ${room}`);
    socket.join(room);
    socket.on("send-message", (message: message) => {
      console.log(`${socket.id.substring(0, 7)} sent ${message.message}`);
      io.to(room).emit("receive-message", {
        message: message.message,
        time: message.formattedTime,
        sender: socket.id,
      });
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id.substring(0, 7)} Disconnected`);
  });
});

server.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});
