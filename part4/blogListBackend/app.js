require('dotenv').config()
const config = require('./utils/config')
const { info, error } = require('./utils/logger')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()





mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    info('connected to db')
  })
  .catch(()=>{
    error('error occured connecting to db', error.message)
  })

app.use(middleware.tokenExtractor) 
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)




module.exports = app