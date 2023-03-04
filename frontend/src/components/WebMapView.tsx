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
        <div>
          {processedData
            ? Object.keys(processedData).map((val, idx) => {
                return (
                  <button onClick={() => handleClick(idx)} key={idx}>
                    {val}
                  </button>
                );
              })
            : ""}
        </div>
        <Line
          height={120}
          width={600}
          data={{
            labels: displayData["hourlyTime"],
            datasets: [
              {
                label: `hourly temperature / timezone`,
                backgroundColor: "#0d0101",
                borderColor: "#0d0101",
                pointBackgroundColor: "#0d0101",
                pointBorderColor: "#0d0101",
                data: displayData["hourlyTemperature"],
              },
              {
                label: `hourlyRelativeHumidity`,
                backgroundColor: "#0d0101",
                borderColor: "#0d0101",
                pointBackgroundColor: "#0d0101",
                pointBorderColor: "#0d0101",
                data: displayData["hourlyRelativeHumidity"],
              },
              {
                label: `hourlyPrecipitationProbability`,
                backgroundColor: "#0d0101",
                borderColor: "#0d0101",
                pointBackgroundColor: "#0d0101",
                pointBorderColor: "#0d0101",
                data: displayData["hourlyPrecipitationProbability"],
              },
              {
                label: `hourlyWeatherCode`,
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
                  color: "#0d0101",
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
                  color: "#0d0101",
                  font: {
                    size: 15,
                    weight: "bold",
                  },
                },
              },
              y: {
                ticks: {
                  color: "#0d0101",
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
  );
};
