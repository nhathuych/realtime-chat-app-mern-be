import express from 'express'
import messagesController from '../controllers/messages.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/:userToChatId', authenticateToken, messagesController.getMessages)
router.post('/send/:receiverId', authenticateToken, messagesController.sendMessage)

export default router
