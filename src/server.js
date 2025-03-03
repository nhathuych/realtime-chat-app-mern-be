import { connectDB } from './lib/database.js'
import { httpServer } from './index.js'

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB()
})
