import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!decodedToken) return res.status(401).json({ message: 'Access denied. Invalid token.' })

    const user = await User.findById(decodedToken.userId).select('-password') // Don't retrieve the password field.
    if (!user) return res.status(401).json({ message: 'Access denied. User not found.' })

    req.user = user // Store the user in the req object for use in other routes.
    next() // Move to the next middleware
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}
