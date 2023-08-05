import React, { useState } from "react";
import { initPoint, MapBox } from "./MapBox";
import { ChartView } from "./ChartView";
import { initResData, openMeteoApiCall } from "./WeatherForecast";
import type { ResData } from "./WeatherForecast";
import { initTimezone } from "./TimezonePicker";

export type Point = {
  lat: number;
  lng: number;
};

export interface IsOpenMeteoForecastData {
  openMeteoForecastData(point: Point, timezone: string | undefined): void;
}

export const MapView: React.FC = () => {
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

    const data = openMeteoApiCall({ lat: lastLat, lng: lastLng }, lastTimezone);
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
