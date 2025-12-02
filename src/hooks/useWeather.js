import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../context";

// 50378ffd89ddd93c360213b2a851ee8d
//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
//https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=50378ffd89ddd93c360213b2a851ee8d
//https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=bba75c2869b447636ef46c292f1e1ca6

const API_KEY = "50378ffd89ddd93c360213b2a851ee8d";
const UNITS = "metric ";

const useWeather = () => {
    const [weatherData, setWeatherData] = useState({
        location: "",
        climate: "",
        temperature: "",
        maxTemperature: "",
        minTemperature: "",
        humidity: "",
        cloudePercentage: "",
        wind: "",
        time: "",
        longitude: "",
        latitude: "",
    });

    const [loading, setLoading] = useState({
        state: false,
        message: "",
    });

    const [error, setError] = useState(null);

    const { selectedLocation } = useContext(LocationContext);

    // console.log(selectedLocation);

    const fetchWeatherData = async (latitude, longitude) => {
        try {
            setLoading({
                ...loading,
                state: true,
                message: "Fetching weather data...",
            });
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${
                    import.meta.env.VITE_WEATHER_API_KEY
                }&units=${UNITS}`
            );
            if (!response.ok) {
                const errorMessage = `Fetching weather data failed: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();

            const updateWeatherData = {
                ...weatherData,
                location: data?.name,
                climate: data?.weather[0]?.main,
                temperature: data?.main?.temp,
                maxTemperature: data?.main?.temp_max,
                minTemperature: data?.main?.temp_min,
                humidity: data?.main?.humidity,
                cloudePercentage: data?.clouds?.all,
                wind: data?.wind?.speed,
                time: data?.dt,
                longitude: longitude,
                latitude: latitude,
            };
            setWeatherData(updateWeatherData);
        } catch (err) {
            setError(err);
        } finally {
            setLoading({
                ...loading,
                state: false,
                message: "Fetching done",
            });
        }
    };

    useEffect(() => {
        setLoading({
            ...loading,
            state: true,
            message: "Finding location...",
        });

        if (selectedLocation.latitude && selectedLocation.longitude) {
            fetchWeatherData(
                selectedLocation.latitude,
                selectedLocation.longitude
            );
        } else {
            navigator.geolocation.getCurrentPosition(function (position) {
                fetchWeatherData(
                    position.coords.latitude,
                    position.coords.longitude
                );
            });
        }
    }, [selectedLocation.latitude, selectedLocation.longitude]);

    return {
        weatherData,
        error,
        loading,
    };
};

export default useWeather;
