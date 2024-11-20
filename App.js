import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ScrollView, Image, FlatList } from 'react-native';
import { fetchWeatherData, fetchForecastData, addCityToFavorites, removeCityFromFavorites } from './api';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]); 

  const handleGetWeather = async () => {
    if (!city) {
      Alert.alert('Error', 'Please enter a city');
      return;
    }

    setLoading(true);

    try {
      const weatherData = await fetchWeatherData(city);
      setWeather(weatherData);

      const forecastData = await fetchForecastData(city);
      setForecast(forecastData);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = () => {
    setFavorites(addCityToFavorites(city, favorites));
  };

  const handleRemoveFromFavorites = () => {
    setFavorites(removeCityFromFavorites(city, favorites));
  };

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const renderHourlyForecast = ({ item }) => {
    return (
      <View style={styles.forecastItem}>
        <Text style={styles.forecastText}>
          Time: {new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.forecastText}>Temp: {item.main.temp}°C</Text>
        <Text style={styles.forecastText}>Weather: {item.weather[0].description}</Text>
        
        <Image
          source={{ uri: getWeatherIcon(item.weather[0].icon) }}
          style={styles.forecastIcon}
        />
      </View>
    );
  };

  const renderDailyForecast = ({ item }) => {
    return (
      <View style={styles.forecastItem}>
        <Text style={styles.forecastText}>
          Date: {new Date(item.dt * 1000).toLocaleDateString()}
        </Text>
        <Text style={styles.forecastText}>Temp: {item.temp.day}°C</Text>
        <Text style={styles.forecastText}>Weather: {item.weather[0].description}</Text>
        
        <Image
          source={{ uri: getWeatherIcon(item.weather[0].icon) }}
          style={styles.forecastIcon}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Current Weather Section */}
      {weather && (
        <View style={styles.currentWeatherContainer}>
          <Text style={styles.weatherText}>Current Weather in {city}:</Text>
          <Text style={styles.weatherText}>Temperature: {weather.main.temp}°C</Text>
          <Text style={styles.weatherText}>Weather: {weather.weather[0].description}</Text>
          <Text style={styles.weatherText}>Humidity: {weather.main.humidity}%</Text>
          
          <Image
            source={{ uri: getWeatherIcon(weather.weather[0].icon) }}
            style={styles.weatherIcon}
          />
        </View>
      )}

      {/* Hourly Forecast Section */}
      {forecast && (
        <View style={styles.forecastSection}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <FlatList
            data={forecast.list.slice(0, 8)} // Show first 8 hours
            renderItem={renderHourlyForecast}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}

      {/* Daily Forecast Section */}
      {forecast && (
        <View style={styles.forecastSection}>
          <Text style={styles.sectionTitle}>Daily Forecast</Text>
          <FlatList
            data={forecast.daily}
            renderItem={renderDailyForecast}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}

      {/* Search Bar Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter city"
        />
        <Button title="Get Weather" onPress={handleGetWeather} disabled={loading} />
        <Button title="Add to Favorites" onPress={handleAddToFavorites} disabled={!city} />
        <Button title="Remove from Favorites" onPress={handleRemoveFromFavorites} disabled={!city} />
      </View>

      {/* Favorite Cities Section */}
      <View style={styles.favoritesContainer}>
        <Text style={styles.favoritesText}>Favorite Cities:</Text>
        {favorites.length > 0 ? (
          favorites.map((favCity, index) => (
            <Text key={index} style={styles.favoritesText}>
              {favCity}
            </Text>
          ))
        ) : (
          <Text style={styles.favoritesText}>No favorites added yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  currentWeatherContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 18,
    marginVertical: 5,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  forecastSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  forecastText: {
    fontSize: 16,
    marginVertical: 5,
  },
  forecastItem: {
    marginBottom: 10,
    alignItems: 'center',
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginTop: 5,
  },
  searchContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  favoritesContainer: {
    marginTop: 20,
  },
  favoritesText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
