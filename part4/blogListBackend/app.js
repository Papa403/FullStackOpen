require('dotenv').config()
const config = require('./utils/config')
const { info, error } = require('./utils/logger')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()





mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    info('connected to db')
  })
  .catch(()=>{
    error('error occured connecting to db', error.message)
  })

app.use(express.json())
app.use('/api/blogs', blogsRouter)





module.exports = app