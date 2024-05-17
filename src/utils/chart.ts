import { CurrentData, HourlyData, ResData } from '../types/open-meteo';
import { getDayAbbreviation, getMonthAbbreviation } from './date';
import { getDescriptionFromWeatherCode } from './open-meteo';

export const collectChartData = (data: ResData) => {
  let date: number = 99;
  let month: number = 99;
  let day: number = 99;
  let dateIndies: { [key: string]: number } = {};
  let dailyData: { [key: string]: HourlyData } = {};

  // dailyData: an associative array to collect daily data
  data['hourly']['time'].forEach((val, idx, _) => {
    const dateAndTime = new Date(val);

    if (day !== dateAndTime.getDay()) day = dateAndTime.getDay();
    if (date !== dateAndTime.getDate()) date = dateAndTime.getDate();
    if (month !== dateAndTime.getMonth()) month = dateAndTime.getMonth();

    const monthDate = `${getDayAbbreviation(day)} ${getMonthAbbreviation(
      month
    )} ${date}`;
    if (dailyData[monthDate] === undefined)
      dailyData[monthDate] = {
        hourlyTime: [],
        hourlyTemperature: [],
        hourlyRelativeHumidity: [],
        hourlyPrecipitationProbability: [],
        hourlyWeatherCode: [],
      };
    dailyData[monthDate]['hourlyTime'].push(
      dateAndTime.toLocaleTimeString([], {
        hour: 'numeric',
      })
    );

    dateIndies[monthDate] = idx;
  });

  // flags to specify daily data
  const monthDateList = Object.keys(dateIndies);
  const lastIndexEachMonthDate = Object.values(dateIndies);
  let lastIndex: number = 0;

  // divide hourly data into daily data
  // [[15.6, 15.4, ...], [15.6, 15.4, ...], ...]
  const hourlyTemperatureGroupByDate = lastIndexEachMonthDate.map(
    (val, idx) => {
      const start = idx === 0 ? idx : lastIndex;
      lastIndex = val;
      return data['hourly']['temperature_2m'].slice(start, val + 1);
    }
  );
  const hourlyHumidityGroupByDate = lastIndexEachMonthDate.map((val, idx) => {
    const start = idx === 0 ? idx : lastIndex;
    lastIndex = val;
    return data['hourly']['relativehumidity_2m'].slice(start, val + 1);
  });
  const hourlyPrecipitationProbabilityGroupByDate = lastIndexEachMonthDate.map(
    (val, idx) => {
      const start = idx === 0 ? idx : lastIndex;
      lastIndex = val;
      return data['hourly']['precipitation_probability'].slice(start, val + 1);
    }
  );
  const hourlyWeatherCodeGroupByDate = lastIndexEachMonthDate.map(
    (val, idx) => {
      const start = idx === 0 ? idx : lastIndex;
      lastIndex = val;
      return data['hourly']['weathercode'].slice(start, val + 1);
    }
  );

  // add hourly data to daily data
  hourlyTemperatureGroupByDate.forEach(
    (val, idx, _) => (dailyData[monthDateList[idx]]['hourlyTemperature'] = val)
  );
  hourlyHumidityGroupByDate.forEach(
    (val, idx, _) =>
      (dailyData[monthDateList[idx]]['hourlyRelativeHumidity'] = val)
  );
  hourlyPrecipitationProbabilityGroupByDate.forEach(
    (val, idx, _) =>
      (dailyData[monthDateList[idx]]['hourlyPrecipitationProbability'] = val)
  );
  hourlyWeatherCodeGroupByDate.forEach(
    (val, idx, _) => (dailyData[monthDateList[idx]]['hourlyWeatherCode'] = val)
  );

  const dateAndTime = new Date(data['current_weather']['time']);
  day = dateAndTime.getDay();
  date = dateAndTime.getDate();
  month = dateAndTime.getMonth();
  const time = dateAndTime.toLocaleTimeString([], {
    hour: 'numeric',
  });

  const currentData: CurrentData = {
    time: `${getDayAbbreviation(day)} ${getMonthAbbreviation(
      month
    )} ${date}, ${time}`,
    temperature: data['current_weather']['temperature'],
    weather: getDescriptionFromWeatherCode(
      data['current_weather']['weathercode']
    ),
  };

  return {
    dailyData: dailyData,
    currentData: currentData,
  };
};
