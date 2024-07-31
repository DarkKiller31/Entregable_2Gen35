import React from 'react';
import './styles/SearchInput.css'

function SearchInput({ city, setCity }) {
  return (
    <input 
      className='search'
      type="text"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      placeholder="Enter city name"
    />
  );
}

export default SearchInput;
