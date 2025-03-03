import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../src/index.js'
import User from '../../src/models/user.model.js'
import bcrypt from 'bcryptjs'

describe('Auth API', () => {
  let server

  beforeAll(async () => {
    await mongoose.connect(process.env.GITHUB_ACTIONS_MONGO_URI || 'mongodb://127.0.0.1:27017/realtime-chat-app-dbtest')
    server = app.listen(3002)

    await request(app).post('/api/v1/auth/signup').send({ fullName: 'Elon Musk', email: 'elon@tesla.com', password: '123456' })
  })

  afterEach(jest.restoreAllMocks)

  afterAll(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
    await server.close()
  })

  describe('POST /api/v1/auth/signup', () => {
    it('should successfully create a new user', async () => {
      const { status, body } = await request(app).post('/api/v1/auth/signup').send({ fullName: 'Huy Huy', email: 'huy@gmail.com', password: '123456' })

      expect(status).toBe(201)
      expect(body).toHaveProperty('_id')
      expect(body).toMatchObject({ fullName: 'Huy Huy', email: 'huy@gmail.com' })
      expect(body.password).toBeUndefined() // Ensure password is not returned
    })

    it('should return an error when email is already registered', async () => {
      const { status } = await request(app).post('/api/v1/auth/signup').send({ fullName: 'Huy heo', email: 'elon@tesla.com', password: '123456' })
      expect(status).toBe(400)
    })

    it('should return an error when request body is empty', async () => {
      const { status } = await request(app).post('/api/v1/auth/signup')
      expect(status).toBe(400)
    })

    it('should return an error when password is too short', async () => {
      const { status } = await request(app).post('/api/v1/auth/signup').send({ fullName: 'Huy Huy', email: 'huy@gmail.com', password: '12345' })
      expect(status).toBe(400)
    })

    it('should return 500 when there is a server error', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'))
      const { status, body } = await request(app).post('/api/v1/auth/signup').send({ fullName: 'Huy Huy', email: 'huy@gmail.com', password: '123456' })

      expect(status).toBe(500)
      expect(body).toHaveProperty('message', 'Database error')

      User.findOne.mockRestore() // Cleanup mock
    })
  })

  describe('POST /api/v1/auth/login', () => {
    it('should return user info on successful login', async () => {
      const { status, body, headers } = await request(app).post('/api/v1/auth/login').send({ email: 'elon@tesla.com', password: '123456' })
      const cookies = headers['set-cookie']
      const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='))

      expect(status).toBe(200)
      expect(body).toHaveProperty('_id')
      expect(body).toMatchObject({ fullName: 'Elon Musk', email: 'elon@tesla.com' })
      expect(body.password).toBeUndefined()

      expect(cookies).toBeDefined()
      expect(jwtCookie).toBeDefined()
    })

    it('should return 400 when password is incorrect', async () => {
      const { status } = await request(app).post('/api/v1/auth/login').send({ email: 'huy@gmail.com', password: '12345654321' })
      expect(status).toBe(400)
    })

    it('should return 400 when email or password is missing', async () => {
      const { status } = await request(app).post('/api/v1/auth/login')
      expect(status).toBe(400)
    })

    it('should return 400 when login with invalid credentials', async () => {
      const { status } = await request(app).post('/api/v1/auth/login').send({ email: 'donal.trump@president.us', password: '12321' })
      expect(status).toBe(400)
    })

    it('should return 500 if bcrypt.compare() throws an error', async () => {
      jest.spyOn(bcrypt, 'compare').mockRejectedValueOnce(new Error('Hashing error'))
      const { status, body } = await request(app).post('/api/v1/auth/login').send({ email: 'elon@tesla.com', password: '123456' })

      expect(status).toBe(500)
      expect(body).toHaveProperty('message', 'Hashing error')
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    it('should clear JWT cookie', async () => {
      const { status, headers } = await request(app).post('/api/v1/auth/logout')
      const cookies = headers['set-cookie']
      const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='))

      expect(status).toBe(200)
      expect(jwtCookie['jwt']).toBe(undefined)
    })
  })
})
