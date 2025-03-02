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
