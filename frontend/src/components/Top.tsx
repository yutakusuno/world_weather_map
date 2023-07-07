import React, { useState } from "react";
import { MapBox } from "./MapBox";
import { ChartView } from "./ChartView";
import { initResData, openMeteoApiCall } from "./WeatherForecast";
import type { ResData } from "./WeatherForecast";

export type Point = {
  lat: number;
  lng: number;
};

export interface IsOpenMeteoForecastData {
  openMeteoForecastData(point: Point): void;
}

export const MapView: React.FC = () => {
  const [resData, setResData] = useState<ResData>(initResData);

  const openMeteoForecastData = async (point: Point) => {
    const data = openMeteoApiCall({
      lat: point.lat,
      lng: point.lng,
    });
    setResData(await data);
  };

  return (
    <>
      <MapBox openMeteoForecastData={openMeteoForecastData} />
      <ChartView resData={resData} />
    </>
  );
};
