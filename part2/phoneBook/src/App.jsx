import { useState,useEffect } from 'react'
import axios from 'axios'

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

const Persons = ({personsToShow}) => (personsToShow.map(person=><div>{person.name} {person.number}</div>))

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber] = useState('')
  const [search,setNewSearch] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then(response => setPersons(response.data))
  },[])
  
  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const isDuplicate = persons.some(person => person.name === newName)
    if (isDuplicate) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const nextId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 1
    const nextNote = {name: newName, number: newNumber, id: nextId}
    axios.post('http://localhost:3001/persons',nextNote).then(response => {
    setPersons(persons.concat(response.data))
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
      <Persons personsToShow={personsToShow}/>
    </div>
  )
}

export default App