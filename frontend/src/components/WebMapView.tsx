import React, { useEffect, useState } from "react";
import { loadModules } from "esri-loader"; // https://github.com/Esri/esri-loader
import "./WebMapView.css";
import {
  initDisplayData,
  initResData,
  openMeteoApiCall,
} from "./WeatherForecast";
import type { displayData, resData, Point } from "./WeatherForecast";

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
  const [resData, setResData] = useState<resData>(initResData);
  const [displayData, setDisplayData] = useState<displayData>(initDisplayData);

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const cleanTimeSlider = (first: boolean = false) => {
    const timeSlider = document.getElementById("timeSlider");
    if (timeSlider !== null && timeSlider.hasChildNodes()) {
      const timeSliderCount = timeSlider.childElementCount;
      let n = first ? 0 : 1;
      while (timeSlider.firstChild && n < timeSliderCount) {
        n++;
        timeSlider.removeChild(timeSlider.firstChild);
      }
    }
  };

  const getWeatherData = async (point: Point) => {
    const data = openMeteoApiCall({
      latitude: point.latitude,
      longitude: point.longitude,
    });
    setResData(await data);
  };

  const processingData = (data: resData) => {
    console.log("resData", data);
    const limit: number = 72; // display data up to 72 hours
    const currentTime = data["current_weather"]["time"];
    let validHourlyTimeIndies: boolean[] = new Array(false);

    // collect data after current time
    const hourlyTime = data["hourly"]["time"]
      .filter((val: string, idx: number) => {
        const bool = new Date(currentTime).getTime() <= new Date(val).getTime();
        validHourlyTimeIndies[idx] = bool;
        return bool;
      })
      .slice(0, limit);

    const hourlyTemperature = data["hourly"]["temperature_2m"]
      .filter((val: number, idx: number) => {
        return validHourlyTimeIndies[idx];
      })
      .slice(0, limit);

    setDisplayData({
      time: currentTime,
      unit: data["hourly_units"]["temperature_2m"],
      temperature: data["current_weather"]["temperature"],
      timezone: data["timezone"],
      hourlyTime: hourlyTime,
      hourlyTemperature: hourlyTemperature,
    });
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
    ).then(([Map, MapView, FeatureLayer, TimeSlider, Expand, Legend]) => {
      const layer = new FeatureLayer({
        url: "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NDFD_Precipitation_v1/FeatureServer/0",
      });

      // create the Map
      const map = new Map({
        basemap: "hybrid",
        layers: [layer],
      });

      // create the MapView
      const mapView = new MapView({
        container: "viewDiv",
        map: map,
        center: [-80, 30],
        zoom: 4,
      });

      const legend = new Legend({
        view: mapView,
      });

      const legendExpand = new Expand({
        expandIconClass: "esri-icon-legend",
        expandTooltip: "Legend",
        view: mapView,
        content: legend,
        expanded: false,
      });

      mapView.ui.add(legendExpand, "top-left");
      mapView.ui.add("lineChart", "top-right");

      mapView.whenLayerView(layer).then((lv: any) => {
        // Prevent duplicate display of TimeSlider by StrictMode
        cleanTimeSlider(true);
        (async () => {
          new TimeSlider({
            container: "timeSlider",
            view: mapView,
            timeVisible: true, // show the time stamps on the timeslider
            loop: false,
            fullTimeExtent: layer.timeInfo.fullTimeExtent.expandTo("hours"),
            stop: {
              interval: layer.timeInfo.interval,
            },
          });

          await delay(300);
          cleanTimeSlider();
        })();
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
    processingData(resData);
  }, [resData]);

  return (
    <div id="viewDiv">
      <div id="lineChart">
        <Line
          height={150}
          width={100}
          data={{
            labels: displayData["hourlyTime"],
            datasets: [
              {
                label: `hourly temperature ${displayData["unit"]} / timezone ${displayData["timezone"]}`,
                backgroundColor: "#ffffff",
                borderColor: "#ffffff",
                pointBackgroundColor: "#ffffff",
                pointBorderColor: "#ffffff",
                data: displayData["hourlyTemperature"],
              },
            ],
          }}
          options={{
            indexAxis: "y",
            plugins: {
              // https://www.chartjs.org/docs/master/configuration/legend.html
              legend: {
                labels: {
                  color: "#fff",
                  font: {
                    size: 15, // px
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
                    size: 15, // px
                    weight: "bold",
                  },
                },
              },
              y: {
                ticks: {
                  color: "#ffffff",
                  font: {
                    size: 15, // px
                    weight: "bold",
                  },
                },
              },
            },
          }}
        />
      </div>
      <div id="footerDiv" className="esri-widget">
        <div id="timeSlider" />
      </div>
    </div>
  );
};
