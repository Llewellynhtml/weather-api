
import { API_BASE_URL, API_KEY } from './config';


export const fetchWeatherData = async (city) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};


export const fetchForecastData = async (city) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
};


export const addCityToFavorites = (city, favorites) => {
  if (!favorites.includes(city)) {
    favorites.push(city);
  }
  return favorites;
};


export const updateCityInFavorites = (oldCity, newCity, favorites) => {
  const index = favorites.indexOf(oldCity);
  if (index !== -1) {
    favorites[index] = newCity;
  }
  return favorites;
};

export const removeCityFromFavorites = (city, favorites) => {
  const index = favorites.indexOf(city);
  if (index !== -1) {
    favorites.splice(index, 1);
  }
  return favorites;
};
