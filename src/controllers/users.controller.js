import User from '../models/user.model.js'
import cloudinary from '../lib/cloudinary.js'

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

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select('-password')

    res.status(200).json(users)
  } catch (error) {
    console.error('Failed to get users for sidebar:', error)
    res.status(500).json({ message: error.message })
  }
}

export default { getUserProfile, uploadProfilePicture, getUsersForSidebar }
