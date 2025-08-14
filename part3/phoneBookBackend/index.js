require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Entry = require('./models/person')
const app = express()

let persons = []

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

morgan.token('body', (request, response) => {
  return request.method === 'POST'
    ? JSON.stringify(request.body)
    : ' '
})

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.get('/', (request,response) => {
  response.send('<h1>Hello person<h1>')
})

app.get('/api/persons', (request,response) => {
  Entry.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons/:id',(request, response)=> {
  Entry.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
})

app.post('/api/persons', (request,response) => {
  const body = request.body

  if(!body.name || !body.number) {
    return response.status(400).json({error: 'content missing'})
  }

  const entry = new Entry({
    name: body.name,
    number: body.number,
  })
  
  entry.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
} 

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
