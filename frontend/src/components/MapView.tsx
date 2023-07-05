import React, { useState } from "react";
import { MapBox } from "./MapBox";
import { ChartView } from "./ChartView";

import { initResData, openMeteoApiCall } from "./WeatherForecast";

import type { ResData, Point } from "./WeatherForecast";

export const MapView: React.FC = () => {
  const [resData, setResData] = useState<ResData>(initResData);

  const getWeatherData = async (point: Point) => {
    const data = openMeteoApiCall({
      lat: point.lat,
      lng: point.lng,
    });
    setResData(await data);
  };

  return (
    <>
      <MapBox getWeatherData={getWeatherData} />
      <ChartView resData={resData} />
    </>
  );
};
