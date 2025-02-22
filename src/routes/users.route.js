import express from 'express'
import usersController from '../controllers/users.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/current', authenticateToken, usersController.getUserProfile)
router.put('/upload-picture', authenticateToken, usersController.uploadProfilePicture)
router.get('/sidebar-users', authenticateToken, usersController.getUsersForSidebar)

export default router
