import { useState, useEffect } from "react"
import Person from "./components/Person"
import PersonForm from "./components/PersonForm"
import Search from "./components/Search"
import Message from "./components/Message"
import personService from "./services/person"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [newSearch, setSearch] = useState("")
  const [message, setMessage] = useState("")
  const [classMessage, setClassMessage] = useState("")

  useEffect(() => {
    // to get initialized the data with the db
    personService.getAll().then((allInitialPersons) => {
      // if promise succeeded, initiate the data returned as the value for the setPersons
      setPersons(allInitialPersons) // sets persons to initialData
    })
  }, []) // executes the effect only once at the first render

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    if (persons.some((person) => person.name === newName)) {
      // update the phone number
      const personSameName = persons.find((p) => p.name === newName)
      if (window.confirm(`${personSameName.name} is already on the phonebook, do you want to replace his number?`)) {
        personService.update(personSameName.id, personObject)
          .then(personUpdated => {
            setPersons(persons.map(p => p.id !== personSameName.id ? p : personUpdated))
            setMessage(`Phone number of '${personUpdated.name}' was updated`)
            setClassMessage('confirmation')
            setTimeout(() => {
              setMessage(null)
              setClassMessage(null)
            }, 5000)
          })
      }
    } else {
      // add the new person to DB
      personService.create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setNewName("") // reset the setNewName variable
          setNewNumber("") // reset the setNewName variable
          setMessage(`'${personObject.name}' added to the phonebook with number '${personObject.number}'`)
          setClassMessage('confirmation')
          setTimeout(() => {
            setMessage(null)
            setClassMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(error.response.data.error)
          setClassMessage('error')
          setTimeout(() => {
            setMessage(null)
            setClassMessage(null)
          }, 5000)
        })
    }
  }

  const handleNewPerson = (event) => setNewName(event.target.value) // sets the value of the newName to the data entered on the form (event.target is the form)
  const handleNewNumber = (event) => setNewNumber(event.target.value)
  const handleSearch = (event) => setSearch(event.target.value)

  const personsToShow =
    newSearch !== ""
      ? persons.filter((person) =>
          person.name.toLowerCase().includes(newSearch.toLowerCase())
        )
      : persons

  const deletePerson = (id) => {
    const personToDelete = persons.find((p) => p.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService.deleteEntry(id)
        .then(() => {
          setMessage(`'${personToDelete.name}' deleted`)
          setClassMessage('confirmation')
          setTimeout(() => {
            setMessage(null)
            setClassMessage(null)
          }, 5000)
          setPersons(persons.filter((person) => person.id !== id)) // updates the list of new persons
        })
        .catch(error => {
          setMessage(`'${personToDelete.name}' was already deleted from the server`)
          setClassMessage('error')
          setTimeout(() => {
            setMessage(null)
            setClassMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== personToDelete.id))
        })
    }
  }

  return (
    <div>
      <Message message={message} classMessage={classMessage}/>
      <h2>Phonebook</h2>
      <Search search={newSearch} handler={handleSearch} />
      <h2>Add new</h2>
      <PersonForm
        addData={addPerson}
        name={newName}
        number={newNumber}
        handleNameChange={handleNewPerson}
        handleNumberChange={handleNewNumber}
      />
      <h2>Numbers</h2>
      {persons.length !== 0 ? (
        personsToShow.map((person) => (
          <Person
            key={person.id}
            name={person.name}
            number={person.number}
            handleDeletePerson={() => deletePerson(person.id)}
          />
        ))
      ) : (
        <p>No entries in the phonebook</p>
      )}
    </div>
  )
}

export default App
