import axios from "axios";

export type Point = {
  latitude: number;
  longitude: number;
};

export const initDisplayData: displayData = {
  temperature: 0,
  time: "",
  timezone: "",
  unit: "",
  hourlyTime: [],
  hourlyTemperature: [],
  hourlyRelativeHumidity: [],
  hourlyPrecipitationProbability: [],
  hourlyWeatherCode: [],
};

export type displayData = {
  temperature: number;
  time: string;
  timezone: string;
  unit: string;
  hourlyTime: string[];
  hourlyTemperature: number[];
  hourlyRelativeHumidity: number[];
  hourlyPrecipitationProbability: number[];
  hourlyWeatherCode: number[];
};

export const initResData: resData = {
  latitude: 52.52,
  longitude: 13.419,
  elevation: 44.812,
  generationtime_ms: 2.2119,
  utc_offset_seconds: 0,
  timezone: "Europe/Berlin",
  timezone_abbreviation: "CEST",
  hourly: {
    time: [
      "2022-01-01T00:00",
      "2022-01-01T01:00",
      "2022-01-01T02:00",
      "2022-01-01T03:00",
      "2022-01-01T04:00",
    ],
    temperature_2m: [10, 5, 20, 15, 10],
    relativehumidity_2m: [45, 44, 42, 39, 39, 40],
    precipitation_probability: [0, 0, 0, 0, 0, 0],
    weathercode: [0, 0, 1, 2, 3, 2],
  },
  hourly_units: {
    time: "iso8601",
    temperature_2m: "°C",
    relativehumidity_2m: "%",
    precipitation_probability: "%",
    weathercode: "wmo code",
  },
  current_weather: {
    time: "2022-01-01T00:00",
    temperature: 13.3,
    weathercode: 3,
    windspeed: 10.3,
    winddirection: 262,
  },
};

export interface resData {
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
}

interface CurrentWeather {
  time: string;
  temperature: number;
  weathercode: number;
  windspeed: number;
  winddirection: number;
}

interface Hourly {
  time: string[];
  temperature_2m: number[];
  relativehumidity_2m: number[];
  precipitation_probability: number[];
  weathercode: number[];
}

interface HourlyUnits {
  time: string;
  temperature_2m: string;
  relativehumidity_2m: string;
  precipitation_probability: string;
  weathercode: string;
}

export const openMeteoApiCall = async (point: Point) => {
  let data: any = {};
  let url: string = "https://api.open-meteo.com/v1/forecast";
  url += `?latitude=${point.latitude}`;
  url += `&longitude=${point.longitude}`;
  url += "&current_weather=true";
  url +=
    "&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode";
  try {
    const response = await axios.get(url);
    data = response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("AxiosError", error);
    } else {
      console.error("UnexpectedError", error);
    }
  } finally {
    return data;
  }
};

export const processingData = (data: resData) => {
  console.log("resData", data);
  const limit: number = 72; // display data up to 72 hours
  const currentTime = data["current_weather"]["time"];
  let validHourlyTimeIndies: boolean[] = new Array(false);

  // collect data after current time
  const hourlyTime = data["hourly"]["time"]
    .filter((val: string, idx: number) => {
      const bool = new Date(currentTime).getTime() <= new Date(val).getTime();
      validHourlyTimeIndies[idx] = bool;
      return bool;
    })
    .slice(0, limit);

  const hourlyTemperature = data["hourly"]["temperature_2m"]
    .filter((val: number, idx: number) => {
      return validHourlyTimeIndies[idx];
    })
    .slice(0, limit);

  const hourlyRelativeHumidity = data["hourly"]["relativehumidity_2m"]
    .filter((val: number, idx: number) => {
      return validHourlyTimeIndies[idx];
    })
    .slice(0, limit);

  const hourlyPrecipitationProbability = data["hourly"][
    "precipitation_probability"
  ]
    .filter((val: number, idx: number) => {
      return validHourlyTimeIndies[idx];
    })
    .slice(0, limit);

  const hourlyWeatherCode = data["hourly"]["weathercode"]
    .filter((val: number, idx: number) => {
      return validHourlyTimeIndies[idx];
    })
    .slice(0, limit);

  return {
    temperature: data["current_weather"]["temperature"],
    time: currentTime,
    timezone: data["timezone"],
    unit: data["hourly_units"]["temperature_2m"],
    hourlyTime: hourlyTime,
    hourlyTemperature: hourlyTemperature,
    hourlyRelativeHumidity: hourlyRelativeHumidity,
    hourlyPrecipitationProbability: hourlyPrecipitationProbability,
    hourlyWeatherCode: hourlyWeatherCode,
  };
};
