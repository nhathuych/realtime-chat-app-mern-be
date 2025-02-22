// using import (ES module) instead of require (CommonJS)
// because "type": "module" is set in package.json
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

// must have a '.js' extension when importing a file
import authRouter from './routes/auth.route.js'
import reqLogger from './lib/req.logger.js'
import { connectDB } from './lib/database.js'

dotenv.config()
const PORT = process.env.PORT || 3001

const app = express()

// This helps the middleware automatically parse JSON from the request body
// In controllers, req.body returns JSON data as an object, making it easier to use
app.use(express.json()) // Middleware JSON

// Register middleware for logging requests.
app.use('/api/v1', reqLogger)

// Register middleware to read cookies
app.use(cookieParser()) // req.cookies

app.use('/api/v1/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB()
})
