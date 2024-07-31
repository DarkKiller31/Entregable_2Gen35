import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import Loader from './components/Loader';
import SearchInput from './components/SearchInput';

function App() {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [temp, setTemp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState("");
  const [infoCities, setInfoCities] = useState([]);

  const success = info => {
    setCoords({
      lat: info.coords.latitude,
      lon: info.coords.longitude
    });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  useEffect(() => {
    if (coords) {
      const APIKEY = 'e56a1318d8c6085f28a11551fd44c719';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${APIKEY}`;

      axios.get(url)
        .then(res => {
          setWeather(res.data);
          const celsius = (res.data.main.temp - 273.15).toFixed(1);
          const fahrenheit = ((9/5 * celsius) + 32).toFixed(1);
          setTemp({
            celsius,
            fahrenheit
          });
        })
        .catch(err => console.log(err))
        .finally(() => setIsLoading(false));
    }
  }, [coords]);

  useEffect(() => {
    if (city) {
      const APIKEY = 'e56a1318d8c6085f28a11551fd44c719';
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKEY}`;
    
      axios.get(url)
        .then(res => {
          const data = res.data.map((item, index) => ({ ...item, id: index.toString() }));
          setInfoCities(data);
        })
        .catch(err => console.log(err));
    }
  }, [city]);

  const handleCitySelect = (lat, lon) => {
    setCoords({ lat, lon });
    setInfoCities([]);
    setCity("");
  };

  const getBackgroundImage = () => {
    if (!weather) return '';
    const mainWeather = weather.weather[0].main.toLowerCase();
    switch (mainWeather) {
      case 'clouds':
        return 'url(/clouds.jpg)';
      case 'clear':
        return 'url(/clear.jpg)';
      case 'atmosphere':
        return 'url(/atmosphere.jpg)';
      case 'snow':
        return 'url(/snow.jpg)';
      case 'rain':
        return 'url(/rain.jpg)';
      case 'drizzle': 
        return 'url(/drizzle.jpg)';
      case 'thunderstorm':
        return 'url(/thunderstorm.jpg)';
    
      default:
        return 'url(/background.jpeg)';
    }
  };


  return (
    <div 
      className='app'
      style={{ backgroundImage: getBackgroundImage() }}
    >
      {isLoading ? <Loader /> : (
        <div>
          <SearchInput city={city} setCity={setCity} />
          <ul className='listOption'>
            {infoCities.map(city => (
              <li className='listItems' key={city.id} onClick={() => handleCitySelect(city.lat, city.lon)}>
                {city.name}, {city.state}, {city.country}
              </li>
            ))}
          </ul>
          {weather && temp && (
            <WeatherCard weather={weather} temp={temp} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
