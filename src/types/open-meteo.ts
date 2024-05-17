export type ResData = {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  hourly: Hourly;
  hourly_units: HourlyUnits;
  current_weather: CurrentWeather;
};

type CurrentWeather = {
  time: string;
  temperature: number;
  weathercode: number;
  windspeed: number;
  winddirection: number;
};

type Hourly = {
  time: string[];
  temperature_2m: number[];
  relativehumidity_2m: number[];
  precipitation_probability: number[];
  weathercode: number[];
};

type HourlyUnits = {
  time: string;
  temperature_2m: string;
  relativehumidity_2m: string;
  precipitation_probability: string;
  weathercode: string;
};

export type HourlyData = {
  hourlyTime: string[];
  hourlyTemperature: number[];
  hourlyRelativeHumidity: number[];
  hourlyPrecipitationProbability: number[];
  hourlyWeatherCode: number[];
};

export type CurrentData = {
  time: string;
  temperature: number;
  weather: string;
};
