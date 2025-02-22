import express from 'express'
import authController from '../controllers/auth.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/profile', authenticateToken, authController.getUserProfile)
router.put('/upload-profile-picture', authenticateToken, authController.uploadProfilePicture)

export default router
