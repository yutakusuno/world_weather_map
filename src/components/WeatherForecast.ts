import { CurrentData, HourlyData, ResData } from '../types/open-meteo';

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

const dayOfStr = (day: number) => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day] || '';
};

const monthOfStr = (day: number) => {
  return (
    [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][day] || ''
  );
};

const wetherCodeOfStr = (weatherCode: number) => {
  const codeDescription = [
    {
      code: 0,
      description: 'Clear sky',
    },
    {
      code: 1,
      description: 'Mainly clear',
    },
    {
      code: 2,
      description: 'Partly cloudy',
    },
    {
      code: 3,
      description: 'Overcast',
    },
    {
      code: 45,
      description: 'Fog',
    },
    {
      code: 48,
      description: 'Depositing rime fog',
    },
    {
      code: 51,
      description: 'Drizzle: Light',
    },
    {
      code: 53,
      description: 'Drizzle: Moderate',
    },
    {
      code: 55,
      description: 'Drizzle: Dense intensity',
    },
    {
      code: 56,
      description: 'Freezing Drizzle: Light',
    },
    {
      code: 57,
      description: 'Freezing Drizzle: Dense intensity',
    },
    {
      code: 61,
      description: 'Rain: Slight',
    },
    {
      code: 63,
      description: 'Rain: Moderate',
    },
    {
      code: 65,
      description: 'Rain: Heavy intensity',
    },
    {
      code: 66,
      description: 'Freezing Rain: Light',
    },
    {
      code: 67,
      description: 'Freezing Rain: Heavy intensity',
    },
    {
      code: 71,
      description: 'Snow fall: Slight',
    },
    {
      code: 73,
      description: 'Snow fall: Moderate',
    },
    {
      code: 75,
      description: 'Snow fall: Heavy intensity',
    },
    {
      code: 77,
      description: 'Snow grains',
    },
    {
      code: 80,
      description: 'Rain showers: Slight',
    },
    {
      code: 81,
      description: 'Rain showers: Moderate',
    },
    {
      code: 82,
      description: 'Rain showers: Violent',
    },
    {
      code: 85,
      description: 'Snow showers: Slight',
    },
    {
      code: 86,
      description: 'Snow showers: Heavy',
    },
    {
      code: 95,
      description: 'Thunderstorm: Slight or moderate',
    },
    {
      code: 96,
      description: 'Thunderstorm with slight hail',
    },
    {
      code: 99,
      description: 'Thunderstorm with heavy hail',
    },
  ];

  let descriptionIndex: number = 999;
  codeDescription.forEach((val, idx, _) => {
    if (val['code'] === weatherCode) descriptionIndex = idx;
  });

  return codeDescription[descriptionIndex]['description'] || '';
};

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

    const monthDate = `${dayOfStr(day)} ${monthOfStr(month)} ${date}`;
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
    time: `${dayOfStr(day)} ${monthOfStr(month)} ${date}, ${time}`,
    temperature: data['current_weather']['temperature'],
    weather: wetherCodeOfStr(data['current_weather']['weathercode']),
  };

  return {
    dailyData: dailyData,
    currentData: currentData,
  };
};
