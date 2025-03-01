import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL]
  }
})

// Broadcast the new message to the receiver so they receive the latest messages
const broadcastNewMessageToReceiver = (receiverId, newMessage) => {
  const onlineReceiverSocketId = userSocketMap[receiverId]
  if (!onlineReceiverSocketId) return // receiver is offline

  // Broadcast only to the receiver
  io.to(onlineReceiverSocketId).emit("newMessage", newMessage)
}

// Stores online users' socket connections
const userSocketMap = {}

const broadcastOnlineUsersToAllConnectedClients = () => {
  // io.emit() is used to send events to all the connected clients
  // Clients listen to "getOnlineUsers" to receive the list of currently online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  console.log("------ getOnlineUsers:", Object.keys(userSocketMap))
}

io.on("connection", (socket) => {
  console.log("------ A user connected with socket ID:", socket.id)

  // When a client connects to the socket, they provide their userId in the query params
  // So we can retrieve their userId and store it in the userSocketMap
  const userId = socket.handshake.query.userId
  if (userId) userSocketMap[userId] = socket.id

  broadcastOnlineUsersToAllConnectedClients()

  socket.on("disconnect", () => {
    delete userSocketMap[userId]
    broadcastOnlineUsersToAllConnectedClients()

    console.log("------ A user disconnected. Socket ID:", socket.id)
  })
})

export { io, app, httpServer, broadcastNewMessageToReceiver }
