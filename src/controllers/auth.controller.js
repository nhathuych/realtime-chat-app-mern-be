import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { generateToken, setTokenInCookie } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) return res.status(400).json({ message: 'Please provide all required fields.' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long.' })

    const user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: 'Email already exists.' })

    const salt = await bcrypt.genSalt(11)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({ fullName, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email
    })
  } catch (error) {
    console.error('Registration failed:', error)
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: 'Please provide all required fields.' })

    const user = await User.findOne({ email: email })
    if (!user) return res.status(400).json({ message: 'This email is not registered. Please sign up first.' })

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password.' })

    const token = generateToken(user._id)
    setTokenInCookie(token, res)

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar
    })
  } catch (error) {
    console.error('Login failed:', error)
    res.status(500).json({ message: error.message })
  }
}

const logout = (req, res) => {
  res.clearCookie('jwt')
  res.json({ message: 'Logged out successfully.' })
}

const getUserProfile = (req, res) => {
  res.status(200).json({ user: req.user })
}

const uploadProfilePicture = async (req, res) => {
  console.log('------ authenticated:', req.user)
  try {
    const { avatar } = req.body
    const userId = req.user._id

    if (!avatar) return res.status(400).json({ message: 'Please provide an avatar.' })

    const uploadedAvatar = await cloudinary.uploader.upload(avatar, { folder: 'avatars' })
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar: uploadedAvatar.secure_url }, { new: true })

    res.status(200).json({ updatedUser })
  } catch (error) {
    console.log('Cloudinary upload error:', error)
    res.status(500).json({ message: error.message })
  }
}

export default { signup, login, logout, getUserProfile, uploadProfilePicture }
