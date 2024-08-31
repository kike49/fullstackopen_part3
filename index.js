const express = require("express")
const morgan = require("morgan")
const app = express()
const PORT = 3001

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Message to confirmt he port access success
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Function to define the id
const generateId = () => {
  id = Math.floor(Math.random() * 999)
  return String(id)
}

// Hard-coded data for the app initialization
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

// Home
app.get("/", (request, response) => {
  response.send("<h1>Home page for the phonebook</h1>")
})

// All persons
app.get("/api/persons", (request, response) => {
  response.json(persons)
})

// Info
app.get("/info", (request, response) => {
  const currentTime = new Date()
  response.send(`
    <p>The phonebook stores data for ${persons.length} people</p>
    <p>${currentTime}</p>
  `)
})

// One person
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const person = persons.find((p) => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Add person
app.post("/api/persons", (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error:
        "Data incomplete, make sure to add name and number for the new entry",
    })
  }
  const existingPerson = persons.find((person) => person.name === body.name)
  if (existingPerson) {
    return response.status(400).json({
      error: "Name already exists in the phonebook",
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)
  response.json(person)
})
