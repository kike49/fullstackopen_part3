require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const serverless = require("serverless-http")
const app = express()
const Person = require("../../models/person")
const PORT = process.env.PORT
const unknownEndpoint = (request, response) => response.status(404).send({ error: "Unknown endpoint" })
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Wrong formatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// Middlewares
app.use(express.static("dist"))
app.use(cors())
app.use(express.json())
morgan.token("body", (req) => JSON.stringify(req.body)) // Customization to show the body on the console
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

// ROUTES
// Info
app.get("/info", (request, response) => {
  Person.countDocuments({})
  .then(count => {
    const currentTime = new Date()
    response.send(`
      <p>The phonebook stores data for ${count} people</p>
      <p>${currentTime}</p>
    `)
  })
  .catch(error => next(error))
})

// All persons
app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((people) => {
      response.json(people)
    })
    .catch(error => next(error))
})

// One person
app.get("/api/persons/:id", (request, response, next) => {
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

// Add person
app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body

  // Create new entry on DB with data
  const person = new Person({
    name: name,
    number: number,
  })
  // Save it and print result
  person.save()
    .then((savedPerson) => response.json(savedPerson))
    .catch(error => next(error))
})

// Delete person
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error))
})

// Update the phone number
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body
  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// Production (Netlify)
module.exports.handler = serverless(app)

// Development
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// At the end to alert of failed endpoints and error registered
app.use(unknownEndpoint)
app.use(errorHandler)
