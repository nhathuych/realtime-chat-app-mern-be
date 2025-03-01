import Message from '../models/message.model.js'
import cloudinary from '../lib/cloudinary.js'
import { broadcastNewMessageToReceiver } from '../lib/socket.js'

const getMessages = async (req, res) => {
  try {
    const { userToChatId } = req.params
    const myUserId = req.user._id

    const messages = await Message.find({
      $or: [
        { senderId: myUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myUserId }
      ]
    })

    res.status(200).json(messages)
  } catch (error) {
    console.error('Failed to get messages:', error)
    res.status(500).json({ message: error.message })
  }
}

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body
    const { receiverId } = req.params
    const senderId = req.user._id

    let imageUrl
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image, { folder: 'images' })
      imageUrl = uploadedImage.secure_url
    }
    const newMessage = new Message({ senderId, receiverId, text, imageUrl })
    await newMessage.save()

    // Broadcast the new message to the receiver so they receive the latest messages
    broadcastNewMessageToReceiver(receiverId, newMessage)

    res.status(201).json(newMessage)
  } catch (error) {
    console.error('Failed to send message:', error)
    res.status(500).json({ message: error.message })
  }
}

export default { getMessages, sendMessage }
