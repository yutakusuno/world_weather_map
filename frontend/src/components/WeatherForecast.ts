import axios from "axios";

export type Point = {
  latitude: number;
  longitude: number;
};

export const initResData: ResData = {
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

export interface ResData {
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

const dayOfStr = (day: number) => {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day] || "";
};

const monthOfStr = (day: number) => {
  return (
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][day] || ""
  );
};

export type DisplayData = {
  hourlyTime: string[];
  hourlyTemperature: number[];
  hourlyRelativeHumidity: number[];
  hourlyPrecipitationProbability: number[];
  hourlyWeatherCode: number[];
};

export const initDisplayData: DisplayData = {
  hourlyTime: [],
  hourlyTemperature: [],
  hourlyRelativeHumidity: [],
  hourlyPrecipitationProbability: [],
  hourlyWeatherCode: [],
};

// prepare current data,in addition to daily data
// type DailyData = {
//   hourlyTime: [];
//   hourlyTemperature: [];
//   hourlyRelativeHumidity: [];
//   hourlyPrecipitationProbability: [];
//   hourlyWeatherCode: [];
// };

export const processingData = (data: ResData) => {
  console.log("resData", data);

  let dailyIndies: { [key: string]: number } = {};
  let dailyData: { [key: string]: DisplayData } = {};

  let date: number = 99;
  let month: number = 99;
  let day: number = 99;

  // make the associative array for collecting daily data
  data["hourly"]["time"].forEach((val, idx, _) => {
    const dateAndTime = new Date(val);
    if (day !== dateAndTime.getDay()) day = dateAndTime.getDay();
    if (date !== dateAndTime.getDate()) date = dateAndTime.getDate();
    if (month !== dateAndTime.getMonth()) month = dateAndTime.getMonth();

    const monthDate = `${dayOfStr(day)}, ${date} ${monthOfStr(month)}`;
    if (dailyData[monthDate] === undefined)
      // TODO when use initDisplayData here, the dailyData breaks
      dailyData[monthDate] = {
        hourlyTime: [],
        hourlyTemperature: [],
        hourlyRelativeHumidity: [],
        hourlyPrecipitationProbability: [],
        hourlyWeatherCode: [],
      };
    dailyData[monthDate]["hourlyTime"].push(
      dateAndTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    dailyIndies[monthDate] = idx;
  });

  // flags to specify daily data
  const monthDateList = Object.keys(dailyIndies);
  const lastIndexEachMonthDate = Object.values(dailyIndies);

  let lastIndex: number = 0;
  lastIndexEachMonthDate
    .map((val, idx) => {
      const start = idx === 0 ? idx : lastIndex;
      lastIndex = val;
      return data["hourly"]["temperature_2m"].slice(start, val);
    })
    .forEach(
      (val, idx, _) =>
        (dailyData[monthDateList[idx]]["hourlyTemperature"] = val)
    );

  lastIndexEachMonthDate
    .map((val, idx) => {
      const start = idx === 0 ? idx : lastIndex;
      lastIndex = val;
      return data["hourly"]["relativehumidity_2m"].slice(start, val);
    })
    .forEach(
      (val, idx, _) =>
        (dailyData[monthDateList[idx]]["hourlyRelativeHumidity"] = val)
    );

  lastIndexEachMonthDate
    .map((val, idx) => {
      const start = idx === 0 ? idx : lastIndex;
      lastIndex = val;
      return data["hourly"]["precipitation_probability"].slice(start, val);
    })
    .forEach(
      (val, idx, _) =>
        (dailyData[monthDateList[idx]]["hourlyPrecipitationProbability"] = val)
    );

  lastIndexEachMonthDate
    .map((val, idx) => {
      const start = idx === 0 ? idx : lastIndex;
      lastIndex = val;
      return data["hourly"]["weathercode"].slice(start, val);
    })
    .forEach(
      (val, idx, _) =>
        (dailyData[monthDateList[idx]]["hourlyWeatherCode"] = val)
    );

  return dailyData;
};
