require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())

morgan.token('body', (req) => JSON.stringify(req.body))

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

// Return the list of persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Return person based on id
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

// Delete a person from phonebook based on id
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// Update a person's number if they already exist based on the id
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    }

    console.log(`id thing: ${request.params.id}`)

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
    })

// Create a new person to add to the phonebook
app.post('/api/persons', morgan(':method :url :body'), (request, response) => {
    const body = request.body;

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing'})
    }

    if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing'})
    }

    // if (hasName(body.name, persons)) {
    //     return response.status(400).json({
    //         error: "name must be unique"
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

   // persons = persons.concat(person)
   
   person.save().then(savedPerson => {
    response.json(savedPerson)
   })
})

// Function to check to see if the persons array already contains a name
const hasName = (personName, persons) => {
    const check = persons.some(person => person.name === personName)
    return check;
}

// Function to return a random id for creating a new person
const randomId = () => {
    const min = Math.ceil(1)
    const max = Math.floor(10000)
    return Math.floor(Math.random() * (max - min) + min);
}

// Create errorHandler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

// Return how many people we have info for in phonebook/persons AND the time when request was received
app.get('/info', (request, response) => {
    response.send(`<h1>Phonebook has info for ${persons.length} people</h1>
    <p>${new Date()}</p>`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})