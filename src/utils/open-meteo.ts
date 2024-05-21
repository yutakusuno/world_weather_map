import { WeatherCodeDescription } from '../types/open-meteo';

export const getDescriptionFromWeatherCode = (weatherCode: number) => {
  const codeDescription: WeatherCodeDescription[] = [
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

  let index: number = 999;
  codeDescription.forEach((val: WeatherCodeDescription, idx, _) => {
    if (val['code'] === weatherCode) {
      index = idx;
    }
  });

  return codeDescription[index]['description'] || '';
};
