import { WeatherForecastDataType } from '../types/open-meteo';
import { Point } from '../types/types';

// https://open-meteo.com/en/docs
export const getWeatherForecastData = async (
  point: Point,
  timezone: string | undefined
): Promise<WeatherForecastDataType | undefined> => {
  let params = `?latitude=${point.lat}`;
  params += `&longitude=${point.lng}`;
  params += '&current_weather=true';
  if (timezone) {
    params += `&timezone=${timezone}`;
  }

  const endpointUrl =
    'https://api.open-meteo.com/v1/forecast' +
    params +
    '&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode';

  try {
    const response = await fetch(endpointUrl);

    if (response.status !== 200) {
      throw new Error(
        `status code: ${response.status}\npoint: ${point.lat},${point.lng}\ntimezone: ${timezone}`
      );
    }

    return await response.json();
  } catch (error) {
    let errorMessage = `Please try the other location. Failed to fetch weather data.`;
    if (error instanceof Error) {
      errorMessage += `\n${error.message}`;
    }
    alert(errorMessage);
  }
};
