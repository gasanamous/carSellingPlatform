const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const session = require('express-session')
const signup = require('./Routers/Register/register')
const signin = require('./Routers/Login/signin')
const addRouter = require('./Routers/Advert/adds')
const app = express()
const userRouter = require('./Routers/User/user')
const adminRouter = require('./Routers/Admin/admin')

const serverIP = 'localhost'
const clientIP = 'http://localhost:5173'

app.listen(3000,serverIP ,() => console.log('Listening on Port 3000'))

app.use(cookieParser())

app.use(cors({ credentials: true, methods: ["POST", "GET"], origin: [`${clientIP}`] }))

app.use(express.urlencoded({ extended: true, limit: '100mb' }))

app.use(express.json({ limit: '100mb' }))

app.use(express.json())

app.use(session({
  secret: 'keykeykeykey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30 * 1.5,
    secure: false,
    httpOnly: true
  },
  rolling: true
}));

app.use('/user/signup', signup)
app.use('/user/signin', signin)
app.use('/adds', addRouter)
app.use('/user', userRouter)
app.use('/administration/', adminRouter)

