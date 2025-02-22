import express from 'express'
import authController from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.put('/upload-profile-picture', authController.uploadProfilePicture)

export default router
