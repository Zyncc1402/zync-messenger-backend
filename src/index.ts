import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
const cron = require("node-cron");
import axios from "axios";

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, this is a GET request response!");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

const io = new Server(server, {
  cors: {
    origin: "*",
    allowedHeaders: "*",
  },
});

// cron.schedule("*/5 * * * *", () => {
//   console.log("Pinging server at route / to keep it alive...");
//   axios
//     .get(
//       process.env.NODE_ENV == "DEVELOPMENT"
//         ? "http://localhost:3001/"
//         : "https://zync-messenger-backend.onrender.com/"
//     )
//     .then((response) => {
//       console.log(`Server responded with status code: ${response.status}`);
//     })
//     .catch((error) => {
//       console.error("Error pinging server:", error.message);
//     });
// });

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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
