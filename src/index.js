// using import (ES module) instead of require (CommonJS)
// because "type": "module" is set in package.json
import express from 'express'
import dotenv from 'dotenv'

import authRouter from './routes/auth.route.js' // must have a '.js' extension when importing a file
import reqLogger from './lib/req.logger.js' // must have a '.js' extension when importing a file

dotenv.config()
const PORT = process.env.PORT || 3001

const app = express()

// Register middleware for logging requests.
app.use('/api/v1', reqLogger)

app.use('/api/v1/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
