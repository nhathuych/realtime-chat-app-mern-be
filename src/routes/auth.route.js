import express from 'express'

const router = express.Router()

router.post('/signup', (req, res) => {
  res.send('Signup route')
})

router.post('/login', (req, res) => {
  res.send('Login route')
})

router.post('/logout', (req, res) => {
  res.send('Logout route')
})

router.put('/upload-profile-picture', (req, res) => {
  res.send('Upload profile picture')
})

export default router
