const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const serverless = require("serverless-http")
const app = express()
const PORT = process.env.PORT || 3001
const unknownEndpoint = (request, response) => response.status(404).send({ error: "unknown endpoint" })

app.use(express.static("dist"))
app.use(cors())
app.use(express.json())
morgan.token("body", (req) => JSON.stringify(req.body)) // Customization to show the body on the console
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

// Function to define the id
const generateId = () => String(Math.floor(Math.random() * 999))

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

// Home view
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

// Delete person
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  persons = persons.filter((p) => p.id !== id)
  response.status(204).end()
})

// Production (Netlify)
module.exports.handler = serverless(app)

// Develoment
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// At the end to alert of failed endpoints
app.use(unknownEndpoint)
