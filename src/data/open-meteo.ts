import { HourlyData, ResData } from '../types/open-meteo';

export const initResData: ResData = {
  latitude: 52.52,
  longitude: 13.419,
  elevation: 44.812,
  generationtime_ms: 2.2119,
  utc_offset_seconds: 0,
  timezone: 'Europe/Berlin',
  timezone_abbreviation: 'CEST',
  hourly: {
    time: ['2022-01-01T00:00', '2022-01-01T01:00', '2022-01-01T02:00'],
    temperature_2m: [10, 5, 20],
    relativehumidity_2m: [45, 44, 42],
    precipitation_probability: [0, 0, 0],
    weathercode: [0, 0, 1],
  },
  hourly_units: {
    time: 'iso8601',
    temperature_2m: '°C',
    relativehumidity_2m: '%',
    precipitation_probability: '%',
    weathercode: 'wmo code',
  },
  current_weather: {
    time: '2022-01-01T00:00',
    temperature: 13.3,
    weathercode: 3,
    windspeed: 10.3,
    winddirection: 262,
  },
};

export const initDisplayData: HourlyData = {
  hourlyTime: [],
  hourlyTemperature: [],
  hourlyRelativeHumidity: [],
  hourlyPrecipitationProbability: [],
  hourlyWeatherCode: [],
};
