import { useEffect, useState } from 'react';

import { initPoint, MapBox } from './map-box';
import { ChartView } from './chart-view';
import { getWeatherForecastData } from '../api/open-meteo';
import { Point } from '../types/types';
import { WeatherForecastDataType } from '../types/open-meteo';
import { timezones } from '../utils/date';

export const MapView = () => {
  const [weatherForecastData, setWeatherForecastData] = useState<
    WeatherForecastDataType | undefined
  >(undefined);
  const [latLng, setLatLng] = useState<Point>(initPoint);
  const [timezone, setTimezone] = useState<string>(timezones[0].value);

  const handleUpdateWeatherForecast = async (
    point: Point,
    tz: string | undefined
  ): Promise<void> => {
    let [lastLat, lastLng] = [point.lat, point.lng];
    let lastTimezone = timezone;

    if (lastLat === 0 && lastLng === 0) {
      lastLat = latLng.lat;
      lastLng = latLng.lng;
    }

    if (tz) {
      lastTimezone = tz;
    }

    const data = await getWeatherForecastData(
      { lat: lastLat, lng: lastLng },
      lastTimezone
    );

    setWeatherForecastData(data);
    setLatLng({ lat: lastLat, lng: lastLng });
    setTimezone(lastTimezone);
  };

  useEffect(() => {
    async function initWeatherForecastData() {
      const data = await getWeatherForecastData(initPoint, timezones[0].value);
      setWeatherForecastData(data);
    }

    initWeatherForecastData();
  }, []);

  return (
    <>
      <MapBox handleUpdateWeatherForecast={handleUpdateWeatherForecast} />
      <ChartView
        weatherForecastData={weatherForecastData}
        handleUpdateWeatherForecast={handleUpdateWeatherForecast}
      />
    </>
  );
};

// What I want to implement
// Install buttons
// To animate a rain radar,
// To switch map styles,
// To hide a chart view,
