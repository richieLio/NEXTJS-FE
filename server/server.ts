import express from "express";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import next from "next";
import cors from "cors";
import { ExpressPeerServer } from "peer";
require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 4000;

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);

  const io = new SocketServer(server, {
    cors: {
      origin: [
        "http://localhost:9999",
        "https://ssbooking.netlify.app",
        "https://localhost:7183",
      ],
      methods: ["GET", "POST"],
    },
  });

  const corsOptions = {
    origin: [
      "http://localhost:9999",
      "https://ssbooking.netlify.app",
      "https://localhost:7183",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  };

  expressApp.use(cors(corsOptions));
  expressApp.use(express.static("public"));

  const peerServer = ExpressPeerServer(server, {
    debug: true, // TypeScript might complain here
    allow_discovery: true,
  } as any); // Casting to 'any'

  expressApp.use("/myapp", peerServer);

  // Next.js request handling
  expressApp.get("*", (req, res) => {
    return handle(req, res);
  });

  // Socket.IO handling
  io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("join-room", (province) => {
      socket.join(province);
      console.log(`User joined room: ${province}`);
    });

    socket.on("on-chat", (data) => {
      io.to(data.province).emit("user-chat", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} with PeerJS on /myapp`);
  });
});
