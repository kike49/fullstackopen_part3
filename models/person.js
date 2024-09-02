const mongoose = require("mongoose")
require("dotenv").config()

// MongoDB connection
const url = process.env.MONGODB_URI // Syntax = ...//{username}:{password}@{clusterName}.{serverConfig}.../{dataBaseName}?...appName={clusterName}
mongoose.set("strictQuery", false)
mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message)
  })

// Schemas and DB settings
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^(\d{2,3}-\d+)$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number, input numbers in the format XX-XXXXX... or XXX-XXXX... with a minimum of 7 digits in total`
    },
    required: true
  }
})

// Modify the output to remove the objects _id and __v from the MongoDB
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Person", personSchema)
