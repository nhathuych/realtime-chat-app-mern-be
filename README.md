# realtime-chat-app-mern-be

## Init project

Add package.json
```
npm init -y
```

Install dependencies
```
npm i express cors mongoose dotenv jsonwebtoken bcryptjs cookie-parser socket.io
```
```
npm i nodemon -D
```

Store images
```
npm i cloudinary
```

## Run in development mode
```
npm run dev
```

## Run with docker in development mode
Add the following to `.env` file
```env
MONGODB_URI=mongodb://root:password@mongodb:27017/realtime-chat-app-mern-stack-development?authSource=admin
```

Start the server
```
docker compose up
```

## Running unit tests
```
npm run test
```

coverage report is generated in `coverage/lcov-report/index.html`

![Image](https://github.com/user-attachments/assets/2de55324-efb7-4637-9d50-9614a782d713)
