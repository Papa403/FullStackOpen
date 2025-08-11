import { useState,useEffect } from 'react'
import Notification from './components/Notification.jsx'
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
    <div key={person.id}>
    {person.name} {person.number} <button onClick={()=>handleDelete(person.id)}>delete</button>
    </div>
  ))
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setNewSearch] = useState('')
  const [message, setMessage] = useState('')
  const [messageStatus, setMessageStatus] = useState('')

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
            setMessage(`updated ${newData.name}`)
            setMessageStatus('updated')
            setTimeout(() => {
              setMessage('')
              setMessageStatus('')
            }, 2000)
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }
    const nextNote = {name: newName, number: newNumber}
    personService.create(nextNote)
      .then(data => {
        setPersons(persons.concat(data))
        setMessage(`Added ${data.name}`)
        setMessageStatus('added')
        setTimeout(() => {
          setMessage('')
          setMessageStatus('')
        }, 2000)
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
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person ? person.name : 'this person'}?`)) {
    personService.deletePerson(id)
      .then(()=>{
        setPersons(persons.filter(person=>person.id !== id))
        setMessage(`Deleted ${person ? person.name : id}`)
        setMessageStatus('deleted')
        setTimeout(() => {
          setMessage('')
          setMessageStatus('')
        }, 4000)
      })
      .catch(() => {
        setMessage('Info has already been deleted from the backend')
        setMessageStatus('error')
        setTimeout(() => {
          setMessage('')
          setMessageStatus('')
        }, 4000)
        setPersons(persons.filter(person=>person.id !== id))
      })
    }
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} status={messageStatus}/>
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