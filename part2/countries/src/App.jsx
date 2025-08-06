import { useState, useEffect } from 'react'
import View from './components/View.jsx'
import apiService from './services/actions.js'

const Countries = ({data, onShow}) => {
  if (data.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (data.length === 1) {
    const country = data[0]
    return <View country={country} />
  } else {
    return (
      <div>
        {data.map(country => 
          <div key={country.name.common}>
            {country.name.common} <button onClick={()=> onShow(country)}>show</button>
      </div>
      )}
      </div>
    )
  }
}

function App() {
  const [search, setSearch] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    apiService
      .getAll()
      .then((response) => setAllCountries(response))
  },[])  
  
  const filteredCountries = allCountries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const handleShow = (country) => {
    setSelectedCountry(country)
  }
  
  return (
    <>
    <form>
      find countries{' '} 
      <input value={search} onChange={handleSearch}/>
    </form>
    {selectedCountry 
      ? <View country={selectedCountry}/>
      : <Countries data={filteredCountries} onShow={handleShow}/>
    }
    </>
  )
}

export default App