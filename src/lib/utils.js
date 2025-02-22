import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
  return token
}

export const setTokenInCookie = (token, res) => {
  res.cookie('jwt', token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS attacks
    sameSite: 'strict', // prevent CSRF attacks
    secure: process.env.NODE_ENV !== 'development', // only send cookie over HTTPS in production
  })
}
