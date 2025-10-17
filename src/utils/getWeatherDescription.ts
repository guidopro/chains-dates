// Helper to convert weather codes to readable text
export const getWeatherDescription = (code: number) => {
  if ([0].includes(code)) return "☀️ Clear sky";
  if ([1, 2, 3].includes(code)) return "⛅ Partly cloudy";
  if ([45, 48].includes(code)) return "🌫️ Fog";
  if ([51, 53, 55].includes(code)) return "🌦️ Drizzle";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "🌧️ Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️ Snow";
  if ([95, 96, 99].includes(code)) return "⛈️ Thunderstorm";
  return "🌍 Unknown";
};
