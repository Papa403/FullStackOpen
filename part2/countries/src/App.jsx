import { useState, useEffect } from 'react'
import apiService from './services/actions.js'

const Countries = ({data}) => {
  if (data.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (data.length === 1) {
      const country = data[0]
      return (
        <div>
          <h1>{country.name.common}</h1>
          <p>Capital {country.capital}</p>
          <p>Area {country.area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
          </ul>
          <img src={country.flags.png}/>
        </div>
      )
  } else return <div>{data.map(country => <div key={country.name.common}>{country.name.common}</div>)}</div>
}

function App() {
  const [search, setSearch] = useState('')
  const [allCountries, setAllCountries] = useState([])

  useEffect(() => {
    apiService
      .getAll()
      .then((response) => setAllCountries(response))
  },[])  
  
  const filtedCountries = allCountries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }
  
  return (
    <>
    <form>
      find countries{' '} 
      <input value={search} onChange={handleSearch}/>
    </form>
    <Countries data={filtedCountries}/>
    </>
  )
}

export default App