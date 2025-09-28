import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import phonebooksService from './services/phonebooks'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [message, setMessage] = useState(null)
  
  useEffect(() => {
    phonebooksService.getAll()
      .then(fullData => { setPersons(fullData) })
      .catch(error => console.log('error found: ', error))
  }, [])

  const addNewPerson = (event) => {
    event.preventDefault()
    const targetIndex = persons.findIndex(person => person.name === newName)
    if (targetIndex > -1) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const targetPerson = persons[targetIndex]
        const newObject = { 
          ...targetPerson ,
          number: newNumber,
        }
        phonebooksService.update(newObject.id, newObject)
          .then(returnedData => {
            setMessage({
              context: `Number of ${returnedData.name} changed to ${returnedData.number}`,
              type: 'info'
            })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            console.log('data updated: ', returnedData)
            const copyPersons = [ ...persons]
            copyPersons[targetIndex] = newObject
            setPersons(copyPersons)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setMessage({
              context: `Information of ${newName} has already been removed from server`,
              type: 'error'
            })
            setPersons(persons.filter(person => person.name != newName))
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    }
    else {
      const newObject = {
        name: newName,
        number: newNumber,
        // id: String(Number(persons[persons.length - 1].id) + 1),
      }
      phonebooksService.create(newObject)
        .then(returnedData => {
          setMessage({
            context: `Added ${returnedData.name}`,
            type: 'info'
          })
          setTimeout(() => {
              setMessage(null)
            }, 5000)
          console.log('data posted: ', returnedData)
          setPersons(persons.concat(returnedData))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setMessage({
            context: `Failed to add ${newName}`,
            type: 'error'
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      phonebooksService.remove(id)
        .then(deletedData => {
          setMessage({
            context: `Data of ${name} with id ${id} is deleted`,
            type: 'info'
          })          
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id != id))
        })
        .catch(error => {
          setMessage({
            context: `Information of ${name} has already been removed from server`,
            type: 'error'
          })
          setPersons(persons.filter(person => person.name != name))
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter value={searchName} onChange={(event) => setSearchName(event.target.value)}/>
      <h3>add a new</h3>
      <PersonForm onSubmit={addNewPerson} nameValue={newName} onNameChange={(event) => setNewName(event.target.value)}
      numberValue={newNumber} onNumberChange={(event) => setNewNumber(event.target.value)} />
      <h3>Numbers</h3>
      {persons.filter(value => value.name.toLowerCase().includes(searchName.toLowerCase())).map(person => 
          <div key={person.id}>
            <Persons person={person} onClick={() => deletePerson(person.name, person.id)} />
          </div>
      )}   
    </div>
  )
}

export default App