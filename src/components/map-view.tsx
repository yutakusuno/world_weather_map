import { useState } from 'react';
import { initPoint, MapBox } from './map-box';
import { ChartView } from './chart-view';
import { initTimezone } from './timezone-picker';
import { Point } from '../types/types';
import { getWeatherForecastData } from '../api/open-meteo';
import { ResData } from '../types/open-meteo';
import { initResData } from '../data/open-meteo';

export const MapView = () => {
  const [resData, setResData] = useState<ResData>(initResData);
  const [lat, setLat] = useState<number>(initPoint.lat);
  const [lng, setLng] = useState<number>(initPoint.lng);
  const [timezone, setTimezone] = useState<string | undefined>(initTimezone);

  const handleUpdateWeatherForecast = async (
    point: Point,
    tz: string | undefined
  ): Promise<void> => {
    let lastLat = point.lat;
    let lastLng = point.lng;
    let lastTimezone = timezone;
    if (point.lat === 0 && point.lng === 0) {
      lastLat = lat;
      lastLng = lng;
    }
    if (tz) lastTimezone = tz;

    const data = await getWeatherForecastData(
      { lat: lastLat, lng: lastLng },
      lastTimezone
    );
    setResData(data);
    setLat(lastLat);
    setLng(lastLng);
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
