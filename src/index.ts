import http from "http";
import { Server } from "socket.io";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    allowedHeaders: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", (room: string) => {
    // console.log(`${socket.id.substring(0, 7)} joined ${room}`);
    socket.join(room);
    socket.on("send-message", (message) => {
      // console.log(`${socket.id.substring(0, 7)} sent ${message}`);
      const date = new Date();
      const formattedTime = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      io.to(room).emit("receive-message", {
        message: message,
        time: formattedTime,
        sender: socket.id,
      });
    });
  });
  socket.on("disconnect", () => {
    console.log(`${socket.id.substring(0, 7)} Disconnected`);
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
