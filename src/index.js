// using import (ES module) instead of require (CommonJS)
// because "type": "module" is set in package.json
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

// must have a '.js' extension when importing a file
import authRouter from './routes/auth.route.js'
import usersRouter from './routes/users.route.js'
import messagesRouter from './routes/messages.route.js'
import reqLogger from './lib/req.logger.js'
import { app, httpServer } from './lib/socket.js'

dotenv.config()

// // already declared in /lib/socket.js, no need to redeclare
// const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL, // specify the client URL that will make requests to our server
  credentials: true, // allow cookies to be sent over HTTP
}))

// This helps the middleware automatically parse JSON from the request body
// In controllers, req.body returns JSON data as an object, making it easier to use
app.use(express.json()) // Middleware JSON

// Register middleware to read cookies
app.use(cookieParser()) // req.cookies

// Register middleware for logging requests.
app.use('/api/v1', reqLogger)

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/messages', messagesRouter)

export {
  app, // for tests
  httpServer // for running server only
}
