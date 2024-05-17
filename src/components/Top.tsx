import { useState } from 'react';
import { initPoint, MapBox } from './MapBox';
import { ChartView } from './ChartView';
import { initResData } from './WeatherForecast';
import { initTimezone } from './TimezonePicker';
import { Point } from '../types/types';
import { getWeatherForecastData } from '../api/open-meteo';
import { ResData } from '../types/open-meteo';

export const MapView = () => {
  const [resData, setResData] = useState<ResData>(initResData);
  const [lat, setLat] = useState<number>(initPoint.lat);
  const [lng, setLng] = useState<number>(initPoint.lng);
  const [timezone, setTimezone] = useState<string | undefined>(initTimezone);

  const openMeteoForecastData = async (
    point: Point,
    tz: string | undefined
  ) => {
    let lastLat = point.lat;
    let lastLng = point.lng;
    let lastTimezone = timezone;
    if (point.lat === 0 && point.lng === 0) {
      lastLat = lat;
      lastLng = lng;
    }
    if (tz) lastTimezone = tz;

    const data = getWeatherForecastData(
      { lat: lastLat, lng: lastLng },
      lastTimezone
    );
    setResData(await data);
    setLat(lastLat);
    setLng(lastLng);
    setTimezone(lastTimezone);
  };

  return (
    <>
      <MapBox openMeteoForecastData={openMeteoForecastData} />
      <ChartView
        resData={resData}
        openMeteoForecastData={openMeteoForecastData}
      />
    </>
  );
};

// What I want to implement
// Install buttons
// To animate a rain radar,
// To switch map styles,
// To hide a chart view,
