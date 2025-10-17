import { fetchWeatherApi } from "openmeteo";
import { useEffect, useState } from "react";
import { getWeatherDescription } from "../../utils/getWeatherDescription";
import "./WeatherWidget.css";

interface AddToWeatherWidgetProps {
  startDate: string;
  endDate: string;
}

export default function WeatherWidget({
  startDate,
  endDate,
}: AddToWeatherWidgetProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //   formats dates for API call
  const formattedStartDate = startDate.slice(0, 10);
  const formattedEndDate = endDate.slice(0, 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          latitude: 53.4809,
          longitude: -2.2374,
          daily: [
            "temperature_2m_min",
            "temperature_2m_max",
            "weather_code",
            "sunrise",
            "sunset",
            "uv_index_max",
            "apparent_temperature_max",
            "apparent_temperature_min",
            "wind_speed_10m_max",
            "wind_gusts_10m_max",
            "wind_direction_10m_dominant",
            "shortwave_radiation_sum",
            "et0_fao_evapotranspiration",
            "uv_index_clear_sky_max",
            "sunshine_duration",
            "daylight_duration",
            "precipitation_probability_max",
            "precipitation_hours",
            "precipitation_sum",
            "snowfall_sum",
            "showers_sum",
            "rain_sum",
          ],
          timezone: "GMT",
          wind_speed_unit: "mph",
          //   slots in formatted event dates
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);

        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];

        // Attributes for timezone and location
        const latitude = response.latitude();
        const longitude = response.longitude();
        const elevation = response.elevation();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const utcOffsetSeconds = response.utcOffsetSeconds();

        console.log(
          `\nCoordinates: ${latitude}°N ${longitude}°E`,
          `\nElevation: ${elevation}m asl`,
          `\nTimezone: ${timezone} ${timezoneAbbreviation}`,
          `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
        );

        const daily = response.daily()!;

        // Define Int64 variables so they can be processed accordingly
        const sunrise = daily.variables(3)!;
        const sunset = daily.variables(4)!;

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
          daily: {
            time: [
              ...Array(
                (Number(daily.timeEnd()) - Number(daily.time())) /
                  daily.interval()
              ),
            ].map(
              (_, i) =>
                new Date(
                  (Number(daily.time()) +
                    i * daily.interval() +
                    utcOffsetSeconds) *
                    1000
                )
            ),
            temperature_2m_min: daily.variables(0)!.valuesArray(),
            temperature_2m_max: daily.variables(1)!.valuesArray(),
            weather_code: daily.variables(2)!.valuesArray(),
            // Map Int64 values to according structure
            sunrise: [...Array(sunrise.valuesInt64Length())].map(
              (_, i) =>
                new Date(
                  (Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000
                )
            ),
            // Map Int64 values to according structure
            sunset: [...Array(sunset.valuesInt64Length())].map(
              (_, i) =>
                new Date(
                  (Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000
                )
            ),
            uv_index_max: daily.variables(5)!.valuesArray(),
            apparent_temperature_max: daily.variables(6)!.valuesArray(),
            apparent_temperature_min: daily.variables(7)!.valuesArray(),
            wind_speed_10m_max: daily.variables(8)!.valuesArray(),
            wind_gusts_10m_max: daily.variables(9)!.valuesArray(),
            wind_direction_10m_dominant: daily.variables(10)!.valuesArray(),
            shortwave_radiation_sum: daily.variables(11)!.valuesArray(),
            et0_fao_evapotranspiration: daily.variables(12)!.valuesArray(),
            uv_index_clear_sky_max: daily.variables(13)!.valuesArray(),
            sunshine_duration: daily.variables(14)!.valuesArray(),
            daylight_duration: daily.variables(15)!.valuesArray(),
            precipitation_probability_max: daily.variables(16)!.valuesArray(),
            precipitation_hours: daily.variables(17)!.valuesArray(),
            precipitation_sum: daily.variables(18)!.valuesArray(),
            snowfall_sum: daily.variables(19)!.valuesArray(),
            showers_sum: daily.variables(20)!.valuesArray(),
            rain_sum: daily.variables(21)!.valuesArray(),
          },
        };

        // 'weatherData' now contains a simple structure with arrays with datetime and weather data
        console.log("\nDaily data", weatherData.daily);
        setWeather(weatherData);
      } catch (err: any) {
        console.error(
          "Error fetching weather:",
          err.message,
          typeof err.message
        );

        if (
          err.message.includes("Parameter 'start_date' is out of allowed range")
        ) {
          setError(
            "Weather forecast unavailable: date is too far in the future."
          );
        } else {
          setError("Unable to fetch weather data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading weather...</p>;
  if (error) {
    return (
      <div className="weather-widget">
        <h2>Weather Forecast</h2>
        <div className="forecast-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <h2>Weather Forecast</h2>

      <div className="daily-forecast">
        {weather.daily.time.map((time: Date, i: number) => (
          <div key={i} className="forecast-card">
            <div className="forecast-date">
              <span className="date-text">
                {time.toLocaleDateString(undefined, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <span className="weather-desc">
                {getWeatherDescription(weather.daily.weather_code[i])}
              </span>
            </div>

            <div className="forecast-values">
              <p title="Temperature">
                🌡️ {weather.daily.temperature_2m_max[i].toFixed(1)}° /{" "}
                {weather.daily.temperature_2m_min[i].toFixed(1)}°
              </p>
              <p title="Max wind speed">
                💨 {weather.daily.wind_speed_10m_max[i].toFixed(1)} km/h
              </p>
              <p title="Precipitation probability">
                💧 {weather.daily.precipitation_probability_max[i]}%
              </p>
              <p title="UV max index">
                🌞 UV {weather.daily.uv_index_max[i].toFixed(1)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
