import { getDayAbbreviation, getMonthAbbreviation } from './date';
import { getDescriptionFromWeatherCode } from './open-meteo';
import {
  CurrentWeatherDataType,
  DailyWeatherDataType,
  WeatherDataForChartType,
  WeatherForecastDataType,
} from '../types/open-meteo';

export const collectWeatherDataForChart = (
  weatherForecastData: WeatherForecastDataType
): WeatherDataForChartType => {
  return {
    dailyWeatherData: getDailyWeatherData(weatherForecastData),
    currentWeatherData: getCurrentWeatherData(weatherForecastData),
  };
};

const getDailyWeatherData = (
  weatherForecastData: WeatherForecastDataType
): DailyWeatherDataType => {
  const monthDateToLastIndex: { [key: string]: number } = {};
  const dailyWeatherData: DailyWeatherDataType = {};

  // Initialize dailyWeatherData
  weatherForecastData['hourly']['time'].forEach((val, idx, _) => {
    const dateAndTime = new Date(val);
    const day = dateAndTime.getDay();
    const date = dateAndTime.getDate();
    const month = dateAndTime.getMonth();
    const hourLabel = dateAndTime.toLocaleTimeString([], {
      hour: 'numeric',
    }); // '12 AM'
    const monthDate =
      getDayAbbreviation(day) +
      ' ' +
      getMonthAbbreviation(month) +
      ' ' +
      String(date); // 'Sun Jan 1'

    // Initialize dailyWeatherData for each day
    if (dailyWeatherData[monthDate] === undefined) {
      dailyWeatherData[monthDate] = {
        hourlyTime: [],
        hourlyTemperature: [],
        hourlyRelativeHumidity: [],
        hourlyPrecipitationProbability: [],
        hourlyWeatherCode: [],
      };
    }

    // Add hourlyTime (1 AM, 2 AM ...) to dailyWeatherData
    dailyWeatherData[monthDate]['hourlyTime'].push(hourLabel);
    monthDateToLastIndex[monthDate] = idx;
  });

  // Decides the range of hourly data for each day
  let currentIndex: number = 0;

  // Assign hourly data to dailyWeatherData
  Object.keys(monthDateToLastIndex).forEach((monthDate: string) => {
    dailyWeatherData[monthDate]['hourlyTemperature'] = weatherForecastData[
      'hourly'
    ]['temperature_2m'].slice(
      currentIndex,
      monthDateToLastIndex[monthDate] + 1
    );

    dailyWeatherData[monthDate]['hourlyRelativeHumidity'] = weatherForecastData[
      'hourly'
    ]['relativehumidity_2m'].slice(
      currentIndex,
      monthDateToLastIndex[monthDate] + 1
    );

    dailyWeatherData[monthDate]['hourlyPrecipitationProbability'] =
      weatherForecastData['hourly']['precipitation_probability'].slice(
        currentIndex,
        monthDateToLastIndex[monthDate] + 1
      );

    dailyWeatherData[monthDate]['hourlyWeatherCode'] = weatherForecastData[
      'hourly'
    ]['weathercode'].slice(currentIndex, monthDateToLastIndex[monthDate] + 1);

    currentIndex = monthDateToLastIndex[monthDate] + 1;
  });

  return dailyWeatherData;
};

const getCurrentWeatherData = (
  weatherForecastData: WeatherForecastDataType
): CurrentWeatherDataType => {
  const dateAndTime = new Date(weatherForecastData['current_weather']['time']);
  const day = dateAndTime.getDay();
  const date = dateAndTime.getDate();
  const month = dateAndTime.getMonth();
  const hourLabel = dateAndTime.toLocaleTimeString([], {
    hour: 'numeric',
  });
  const monthDateHourLabel =
    getDayAbbreviation(day) +
    ' ' +
    getMonthAbbreviation(month) +
    ' ' +
    String(date) +
    ', ' +
    hourLabel; // 'Sun Jan 1, 12 AM'

  console.log(weatherForecastData);

  return {
    time: monthDateHourLabel,
    timeZone: weatherForecastData['timezone'],
    temperature: weatherForecastData['current_weather']['temperature'],
    weather: getDescriptionFromWeatherCode(
      weatherForecastData['current_weather']['weathercode']
    ),
  };
};
