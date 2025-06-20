import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import {Server} from 'socket.io';
import swaggerDocs from './swagger.js';
import axios from 'axios';

dotenv.config();

const port = process.env.PORT || 5500;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Default
 *     summary: Welcome endpoint
 *     description: Returns a welcome message.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to the Node.js backend!
 */
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js backend!' });
});


io.on('connection',(sockets)=>{
    console.log("New client connected",sockets.id);

    sockets.on('message',async ({roomId,data})=>{
      console.log("Received message:", data);
      const response = await axios.post(`${process.env.SPOILER_API_URL}/spoiler-detection`, data,{
        contentType: 'application/json',
      });
      if(response.data.spoiler>=0.5){
        io.to(roomId).emit('message',{message:"This message contains a spoiler!"});
      }else{
        io.to(roomId).emit('message',data);
      }
    });

    sockets.on("join-room", (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
  
    const numClients = room ? room.size : 0;
    console.log(`Client ${sockets.id} joining room ${roomId}. Current clients: ${numClients}`);
    const r =  io.sockets.adapter.rooms.get(roomId);
    sockets.join(roomId);

    // If there's already someone in the room, emit 'ready' to this socket
    if (numClients >0) {
    sockets.roomId = roomId; // Store the room ID in the socket object
    console.log(`Client ${sockets.id} is ready in room ${roomId}`);
      sockets.emit("ready"); // Tell this socket to create offer
    }
    });

    sockets.on("offer", ({roomId,offer}) => sockets.to(roomId).emit("offer", offer));
    sockets.on("answer", ({roomId,answer}) => sockets.to(roomId).emit("answer", answer));
    sockets.on("ice-candidate", ({roomId,candidate}) => sockets.to(roomId).emit("ice-candidate", {candidate}));

    sockets.on('disconnect',()=>{
        console.log("Client disconnected",sockets.id);
    });
  });
    

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  swaggerDocs(app, port);
});