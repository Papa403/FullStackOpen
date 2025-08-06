import {useState, useEffect} from 'react'
import axios from 'axios'
const Weather = ({country}) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(()=>{
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${apiKey}`)
    .then(response => setWeather(response.data))
  },[country, apiKey])

  if (!weather) return <div>Loading...</div>

  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <p>Temperature {(weather.main.temp-273.15).toFixed(2)} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  )
}
export default Weather