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

io.on("connection", (socket) => {
  console.log("------ a user connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("------ a user disconnected:", socket.id)
  })
})

export { io, app, httpServer }
