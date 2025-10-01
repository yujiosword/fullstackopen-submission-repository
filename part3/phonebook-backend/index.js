require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
var morgan = require('morgan')


// creating new tokens method + JSON.stringify
morgan.token('content', (req, res) => (
  req.method === 'POST'
  ? JSON.stringify(req.body) 
  : null
))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(express.json())
app.use(express.static('dist'))

// GET info page
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
        `)
    })
    .catch(error => next(error))
})

// GET phonebook list
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})

// GET phonebook by id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (!person) return res.status(404).end()
      res.json(person)
    })
    .catch(error => next(error))
})

// DELETE phonebook by id
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(person => {
      if (!person) return res.status(404).end()
      return res.status(204).end()
    })
    .catch(error => next(error))
})


// PUT phonebook with id
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  // Person.findById(req.params.id)
  //   .then(person => {
  //     if (!person) {
  //       return res.status(404).end()
  //     }
  //     person.name = name
  //     person.number = number
      
  //     return person.save().then(updatedPerson => {
  //       res.json(updatedPerson)
  //     })
  //   })
  //   .catch(error => next(error))
  Person.findByIdAndUpdate(
    req.params.id,
    {name,number},
    {new:true, runValidators: true}
  )
    .then(updatedPerson => {
      if (!updatedPerson) return res.status(404).end()
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

// POST new phonebook
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  Person.exists({name: body.name})
    .then(result => {
      if (result) {
        return res.status(400).send({error: 'name must be unique'})
      }
      else {
        const person = new Person({
          name: body.name,
          number: body.number,
        })

        return person.save().then(savedPerson => {
          res.status(201).json(savedPerson)
        })
      }
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
  console.log('server is running')
})