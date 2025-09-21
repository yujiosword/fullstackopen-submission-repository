import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.findIndex(person => person.name === newName) > -1) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const newObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      }
      setPersons(persons.concat(newObject))
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={searchName} onChange={(event) => setSearchName(event.target.value)}/>
      <h3>add a new</h3>
      <PersonForm onSubmit={addNewPerson} nameValue={newName} onNameChange={(event) => setNewName(event.target.value)}
      numberValue={newNumber} onNumberChange={(event) => setNewNumber(event.target.value)} />
      <h3>Numbers</h3>
      <Persons persons={persons} filterRule={value => value.name.toLowerCase().includes(searchName.toLowerCase())}/>
    </div>
  )
}

export default App