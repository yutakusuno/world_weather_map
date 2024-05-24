import { useEffect, useState } from 'react';

import { MapBox } from './map-box';
import { ChartView } from './chart-view';
import { getWeatherForecastData } from '../api/open-meteo';
import { Point } from '../types/types';
import { WeatherForecastDataType } from '../types/open-meteo';
import { defaultTimezone } from '../utils/date';
import { getTimeZoneWithLatLng } from '../api/wheretheiss';

const initPoint: Point = {
  lat: 49.246292,
  lng: -123.116226,
};

export const MapView = () => {
  const [latLng, setLatLng] = useState<Point>(initPoint);
  const [timezone, setTimezone] = useState<string>(defaultTimezone['value']);
  const [weatherForecastData, setWeatherForecastData] = useState<
    WeatherForecastDataType | undefined
  >(undefined);

  const handleUpdateWeatherForecast = async (
    point: Point,
    tz: string | undefined
  ): Promise<void> => {
    let [currentLat, currentLng] = [point.lat, point.lng];
    let currentTimezone: string | undefined = undefined;

    if (currentLat === 0 && currentLng === 0) {
      currentLat = latLng.lat;
      currentLng = latLng.lng;
    }

    if (tz) {
      currentTimezone = tz;
    } else {
      const retrievedTimeZone = await getTimeZoneWithLatLng({
        lat: currentLat,
        lng: currentLng,
      });

      // if timezone is not available, use the last selected timezone
      currentTimezone = retrievedTimeZone || timezone;
    }

    const data = await getWeatherForecastData(
      { lat: currentLat, lng: currentLng },
      currentTimezone
    );

    if (!data) {
      return;
    }

    setWeatherForecastData(data);
    setLatLng({ lat: currentLat, lng: currentLng });
    setTimezone(currentTimezone);
  };

  useEffect(() => {
    let ignore = false;

    const initWeatherForecastData = async () => {
      const data = await getWeatherForecastData(
        initPoint,
        defaultTimezone['value']
      );

      if (!ignore) {
        setWeatherForecastData(data);
      }
    };

    initWeatherForecastData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>
      <MapBox
        latLng={latLng}
        handleUpdateWeatherForecast={handleUpdateWeatherForecast}
      />
      <ChartView
        weatherForecastData={weatherForecastData}
        handleUpdateWeatherForecast={handleUpdateWeatherForecast}
      />
    </div>
  );
};
