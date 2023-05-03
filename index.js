const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Return the list of persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Return person based on id
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Create a new person to add to the phonebook
app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        })
    }

    if (hasName(body.name, persons)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: randomId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
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

// Return how many people we have info for in phonebook/persons AND the time when request was received
app.get('/info', (request, response) => {
    response.send(`<h1>Phonebook has info for ${persons.length} people</h1>
    <p>${new Date()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})