import axios from "axios";

export type Point = {
  latitude: number;
  longitude: number;
};

export const initDisplayData: displayData = {
  timezone: "",
  unit: "",
  hourlyTime: [],
  hourlyTemperature: [],
  time: "",
  temperature: 0,
};

export type displayData = {
  time: string;
  unit: string;
  temperature: number;
  timezone: string;
  hourlyTime: string[];
  hourlyTemperature: number[];
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
  },
  hourly_units: {
    temperature_2m: "°C",
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
}

interface HourlyUnits {
  temperature_2m: string;
}

export const openMeteoApiCall = async (point: Point) => {
  let data: any = {};
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${point.latitude}&longitude=${point.longitude}&hourly=temperature_2m&current_weather=true`
    );
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
