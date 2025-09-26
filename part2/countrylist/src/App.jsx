import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [country, setCountry] = useState('') // text from input box
  const [countryList, setCountryList] = useState([]) // country list fetched via api get and map
  const [filterList, setFilterList] = useState([]) // filtered country list based on conditions
  const [countryShow, setCountryShow] = useState(null) // value for a selected country, otherwise null
  const [countryWeather, setCountryWeather] = useState(null) // weather for a selected country, otherwise null
  const api_key = import.meta.env.VITE_OPEN_WEATHER_API_KEY
  
  useEffect(() => {
    // console.log('run useEffect to get all country into countryList')
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        // console.log(`set CountryList`)
        setCountryList(response.data.map(res => ({
            name: res.name.common,
            capital: res.capital,
            area: res.area,
            languages: res.languages,
            flags: res.flags,
            latlng: res.latlng
          })))
        })
      .catch(error => {
        console.log(`error detected: ${error}`)
      })
  }, [])

  useEffect(() => {
    if (countryShow) {
      const targetCountry = countryList.find(res => res.name === countryShow)
      console.log(`api call on ${targetCountry.name}`)
      axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${targetCountry.latlng[0]}&lon=${targetCountry.latlng[1]}&exclude=minutely,hourly,daily&units=metric&appid=${api_key}`)
        .then(res => {
          console.log(`weather data received`)
          console.log(`Temperature: ${res.data.current.temp}, weather icon: ${res.data.current.weather[0].icon}, wind speed: ${res.data.current.wind_speed}`)
          setCountryWeather({
            temp: res.data.current.temp,
            description: res.data.current.weather[0].description,
            icon: res.data.current.weather[0].icon,
            wind_speed: res.data.current.wind_speed
          })
        })
        .catch(error => {
          console.log(`error detected: ${error}`)
        })
    }
    else {
      console.log('no weather api call')
    } 
  }, [countryShow])

  const handleChange = (event) => {
    setCountry(event.target.value)
    const countries = countryList.filter(value => value.name.toLowerCase().includes(event.target.value.toLowerCase()))
    setFilterList(countries)
    countries.length == 1
    ? setCountryShow(countries[0]['name'])
    : setCountryShow(null)
  }

  const countryDetail = (value) => {
    const targetCountry = countryList.find(res => res.name === value)
    return (
        <>
          <h1>{targetCountry['name']}</h1>
          <p>Capital {targetCountry['capital']}</p>
          <p>Area {targetCountry['area']}</p>
          <h2>Languages</h2>
           <ul>
            {Object.values(targetCountry['languages']).map(res => <li key={res}>{(res)}</li>)}
          </ul> 
          <img src={targetCountry['flags']['png']} alt={targetCountry['flags']['alt']} />
          <h2>{`Weather in ${targetCountry['capital'][0]}`}</h2>
          <p>Temperature {countryWeather.temp} Celsius</p>
          <img src={`https://openweathermap.org/img/wn/${countryWeather.icon}@2x.png`} alt={countryWeather.description} />
          <p>Wind {countryWeather.wind_speed} m/s</p>
        </>
    )
  }
  
  const displayInfo = () => {
    if (filterList.length > 10) 
      return (<p>Too many matches, specify another filter</p>) 
    else if (filterList.length == 1) 
      return (
        countryWeather
        ? countryDetail(countryShow)
        : null
      )
    else {
      return (
        <>
          {filterList.map(value => 
            <div key={value.name}>
              {value.name}
              <button onClick={() => {
                setCountryShow(value.name)
              }}>Show</button>
              {countryShow === value.name && countryWeather
                ? countryDetail(countryShow) 
                : null}
            </div>       
          )}
        </>
      )
    }
  }

  return (
    <>
      <div>
        find countries <input value={country} onChange={handleChange} />
      </div>
        {displayInfo()}
    </>
  )
}

export default App