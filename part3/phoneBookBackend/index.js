require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Entry = require('./models/person')
const app = express()

morgan.token('body', (request) => {
  return request.method === 'POST'
    ? JSON.stringify(request.body)
    : ' '
})

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request,response) => {
  response.send('<h1>Hello person<h1>')
})

app.get('/api/persons', (request,response) => {
  Entry.find({})
    .then(person => {
      response.json(person)
    })
})

app.get('/info', (request, response, next) => {
  Entry.countDocuments({})
    .then(count => {
      response.send(`<p>Phonebook has info for ${count} people</p>
    <p>${new Date()}</p>`)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id',(request, response) => {
  Entry.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request,response, next) => {
  const body = request.body

  if(!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }

  const entry = new Entry({
    name: body.name,
    number: body.number,
  })
  entry.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Entry.findById(request.params.id)
    .then((entry) => {
      if(!entry) {
        return response.status(404).end()
      }

      entry.name = name
      entry.number = number

      return entry.save().then((updatedEntry) => {
        response.json(updatedEntry)
      })
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'ValidationError') {
    return response.status(400).send({ error: `${error.message}` })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
