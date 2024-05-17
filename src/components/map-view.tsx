import { useState } from 'react';

import { initPoint, MapBox } from './map-box';
import { ChartView } from './chart-view';
import { initTimezone } from './timezone-picker';
import { getWeatherForecastData } from '../api/open-meteo';
import { initResData } from '../data/open-meteo';
import { Point } from '../types/types';
import { ResData } from '../types/open-meteo';

export const MapView = () => {
  const [resData, setResData] = useState<ResData>(initResData);
  const [latLng, setLatLng] = useState<Point>(initPoint);
  const [timezone, setTimezone] = useState<string | undefined>(initTimezone);

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

    setResData(data);
    setLatLng({ lat: lastLat, lng: lastLng });
    setTimezone(lastTimezone);
  };

  return (
    <>
      <MapBox handleUpdateWeatherForecast={handleUpdateWeatherForecast} />
      <ChartView
        resData={resData}
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
