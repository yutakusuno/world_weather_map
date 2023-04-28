import React, { useEffect, useState } from "react";
import { loadModules } from "esri-loader"; // https://github.com/Esri/esri-loader
import "./WebMapView.css";
import {
  initDisplayData,
  initResData,
  openMeteoApiCall,
  processingData,
} from "./WeatherForecast";
import type { ResData, Point, DisplayData } from "./WeatherForecast";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const WebMapView: React.FC = () => {
  const [resData, setResData] = useState<ResData>(initResData);
  const [processedData, setProcessedData] = useState<{
    [key: string]: DisplayData;
  }>();
  const [displayData, setDisplayData] = useState<DisplayData>(initDisplayData);

  const getWeatherData = async (point: Point) => {
    const data = openMeteoApiCall({
      latitude: point.latitude,
      longitude: point.longitude,
    });
    setResData(await data);
  };

  // Initialize ArcGIS Map
  useEffect(() => {
    // first lazy-load the esri classes
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/TimeSlider",
        "esri/widgets/Expand",
        "esri/widgets/Legend",
      ],
      {
        css: true,
      }
    ).then(([Map, MapView]) => {
      // create the Map
      const map = new Map({
        basemap: "hybrid",
      });

      // create the MapView
      const mapView = new MapView({
        container: "viewDiv",
        map: map,
        center: [-80, 30],
        zoom: 4,
      });

      mapView.on("click", (event: any) => {
        const point = mapView.toMap({ x: event.x, y: event.y });
        getWeatherData({
          latitude: point.latitude,
          longitude: point.longitude,
        });
      });

      // clean up the map view
      return () => {
        mapView && mapView.destroy();
      };
    });
  }, []);

  useEffect(() => {
    const data: { [key: string]: DisplayData } = { ...processingData(resData) };
    setProcessedData(data);
  }, [resData]);

  useEffect(() => {
    console.log("processedData", processedData);
    if (processedData) setDisplayData(Object.values(processedData)[0]);
  }, [processedData]);

  const handleClick = (idx: number) => {
    if (processedData) setDisplayData(Object.values(processedData)[idx]);
  };

  return (
    <div id="viewDiv">
      <div id="lineChart" className="esri-widget">
        <div className="flex justify-normal">
          {processedData
            ? Object.keys(processedData).map((val, idx) => {
                return (
                  <button
                    className="inline-block py-4 mx-1 text-lg font-bold text-white bg-gray-800 px-5 hover:bg-gray-700 opacity-80"
                    onClick={() => handleClick(idx)}
                    key={idx}
                  >
                    {val}
                  </button>
                );
              })
            : ""}
        </div>
        <div className="grid grid-cols-8 gap-4 text-white text-lg font-bold">
          <div className="col-span-1">
            <h1 className="text-3xl mx-1">Now</h1>
            <div className="grid grid-rows-3 grid-flow-col gap-4">
              <div>Temperature</div>
              <div>Humidity</div>
              <div>Precipitation</div>
            </div>
          </div>
          <div className="col-span-7">
            <Line
              height={120}
              width={600}
              data={{
                labels: displayData["hourlyTime"],
                datasets: [
                  {
                    label: `Temperature`,
                    backgroundColor: "#79f988",
                    borderColor: "#79f988",
                    pointBackgroundColor: "#79f988",
                    pointBorderColor: "#79f988",
                    data: displayData["hourlyTemperature"],
                  },
                  {
                    label: `Humidity`,
                    backgroundColor: "#648bff",
                    borderColor: "#648bff",
                    pointBackgroundColor: "#648bff",
                    pointBorderColor: "#648bff",
                    data: displayData["hourlyRelativeHumidity"],
                  },
                  {
                    label: `Precipitation`,
                    backgroundColor: "#ff8383",
                    borderColor: "#ff8383",
                    pointBackgroundColor: "#ff8383",
                    pointBorderColor: "#ff8383",
                    data: displayData["hourlyPrecipitationProbability"],
                  },
                  {
                    label: `Weather Code`,
                    backgroundColor: "#0d0101",
                    borderColor: "#0d0101",
                    pointBackgroundColor: "#0d0101",
                    pointBorderColor: "#0d0101",
                    data: displayData["hourlyWeatherCode"],
                  },
                ],
              }}
              options={{
                plugins: {
                  // https://www.chartjs.org/docs/master/configuration/legend.html
                  legend: {
                    labels: {
                      color: "#ffffff",
                      font: {
                        size: 15,
                        weight: "bold",
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "#ffffff",
                      font: {
                        size: 15,
                        weight: "bold",
                      },
                    },
                  },
                  y: {
                    ticks: {
                      color: "#ffffff",
                      font: {
                        size: 15,
                        weight: "bold",
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
