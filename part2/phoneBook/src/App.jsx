import { useState,useEffect } from 'react'
import personService from './services/actions.js'

const Filter = ({value,onChange}) => (
  <form>
    filter shown with <input value={value} onChange={onChange}/>
  </form>
)

const PersonForm = ({onSubmit,newName,handleNewName,newNumber,handleNewNumber}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={handleNewName}/>
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNewNumber}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({personsToShow, handleDelete}) => (
  personsToShow.map(person => (
    <div>
    {person.name} {person.number} <button onClick={()=>handleDelete(person.id)}>delete</button>
    </div>
  ))
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber] = useState('')
  const [search,setNewSearch] = useState('')

  useEffect(() => {
    personService.getAll().then(data => setPersons(data))
  },[])
  
  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const isDuplicate = persons.some(person => person.name === newName)
    if (isDuplicate) {
      if(window.confirm(`${newName} is already added to phonebook. Do you want to replace with new number?`)) {
        const person = persons.find(person => person.name === newName)
        const newData = {...person, number: newNumber}
        personService.update(newData.id,newData)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === newData.id ? returnedPerson : p))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }
    const nextId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 1
    const nextNote = {name: newName, number: newNumber, id: nextId.toString()}
    personService.create(nextNote)
      .then(data => {
        setPersons(persons.concat(data))
        setNewName('')
        setNewNumber('')
    })
  }
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleNewSearch = (event) => {
    setNewSearch(event.target.value)
  }
  const personsToShow = search
    ? persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))
    : persons

  const handleDelete = (id) => {
    if (window.confirm(`Delete ID ${id}?`)) {
    personService.deletePerson(id)
      .then(()=>{
        setPersons(persons.filter(person=>person.id !== id))
      })
    }
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={search} onChange={handleNewSearch}/>
      <h3>
        add a new
      </h3>
      <PersonForm 
        onSubmit={handleSubmit} 
        newName={newName} 
        handleNewName={handleNewName} 
        newNumber={newNumber} 
        handleNewNumber={handleNewNumber}/>
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App