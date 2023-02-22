import React, { useEffect, useState } from "react";
import { loadModules } from "esri-loader"; // https://github.com/Esri/esri-loader
import "./WebMapView.css";
import axios from "axios";
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

type Point = {
  latitude: number;
  longitude: number;
};

const initialData: OpenMeteoObject = {
  latitude: 52.52,
  longitude: 13.419,
  elevation: 44.812,
  generationtime_ms: 2.2119,
  utc_offset_seconds: 0,
  timezone: "Europe/Berlin",
  timezone_abbreviation: "CEST",
  hourly: {
    time: [
      "2022-01-01T00:00",
      "2022-01-01T01:00",
      "2022-01-01T02:00",
      "2022-01-01T03:00",
      "2022-01-01T04:00",
    ],
    temperature_2m: [0, 10, 20, 10, 0],
  },
  hourly_units: {
    temperature_2m: "°C",
  },
  current_weather: {
    time: "2022-01-01T00:00",
    temperature: 13.3,
    weathercode: 3,
    windspeed: 10.3,
    winddirection: 262,
  },
};

interface OpenMeteoObject {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  hourly: Hourly;
  hourly_units: HourlyUnits;
  current_weather: CurrentWeather;
}

interface CurrentWeather {
  time: string;
  temperature: number;
  weathercode: number;
  windspeed: number;
  winddirection: number;
}

interface Hourly {
  time: string[];
  temperature_2m: number[];
}

interface HourlyUnits {
  temperature_2m: string;
}

type displayDataType = {
  time: string;
  unit: string;
  temperature: number;
  timezone: string;
  hourlyTime: string[];
  hourlyTemperature: number[];
};

const initialDisplayData: displayDataType = {
  timezone: "",
  unit: "",
  hourlyTime: [],
  hourlyTemperature: [],
  time: "",
  temperature: 0,
};

export const WebMapView: React.FC = () => {
  const [data, setData] = useState<OpenMeteoObject>(initialData);
  const [date, setDate] = useState<Date>(new Date());
  const [point, setPoint] = useState<Point>({ latitude: 0, longitude: 0 });
  const [ongoing, setOngoing] = useState<Boolean>(false);
  const [searching, setSearching] = useState<Boolean>(false);
  const [displayData, setDisplayData] =
    useState<displayDataType>(initialDisplayData);

  const checkMultipleClick = () => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    setDate(now);
    return diff < 1000 ? true : false;
  };

  const searchWeather = async (point: Point) => {
    if (checkMultipleClick()) return;
    if (ongoing || !searching) return;
    setOngoing(true);

    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${point.latitude}&longitude=${point.longitude}&hourly=temperature_2m&current_weather=true`
      );
      const resData = response?.data;
      setData(resData);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("AxiosError", error);
      } else {
        console.error("UnexpectedError", error);
      }
      setOngoing(false);
      setSearching(false);
    } finally {
      setOngoing(false);
      setSearching(false);
    }
  };

  // Initialize ArcGIS Map
  useEffect(() => {
    // first lazy-load the esri classes
    loadModules(["esri/Map", "esri/views/MapView"], {
      css: true,
    }).then(([Map, MapView]) => {
      // create the Map
      const map = new Map({
        basemap: "hybrid",
      });

      // create the MapView
      const mapView = new MapView({
        container: "viewDiv",
        map: map,
        center: [-100, 30],
        zoom: 4,
      });

      mapView.on("click", (event: any) => {
        const point = mapView.toMap({ x: event.x, y: event.y });
        setPoint({ latitude: point.latitude, longitude: point.longitude });
        setSearching(true);
      });

      // clean up the map view
      return () => {
        mapView && mapView.destroy();
      };
    });
  }, []);

  useEffect(() => {
    searchWeather({ latitude: point.latitude, longitude: point.longitude });
  }, [searching]);

  const processingData = (data: OpenMeteoObject) => {
    const limit: number = 72; // display data up to 72 hours
    const currentTime = data["current_weather"]["time"];
    let validHourlyTimeIndexes: boolean[] = new Array(false);

    // collect data after current time
    const hourlyTime = data["hourly"]["time"]
      .filter((val: string, idx: number) => {
        const bool = new Date(currentTime).getTime() <= new Date(val).getTime();
        validHourlyTimeIndexes[idx] = bool;
        return bool;
      })
      .slice(0, limit);

    const hourlyTemperature = data["hourly"]["temperature_2m"]
      .filter((val: number, idx: number) => {
        return validHourlyTimeIndexes[idx];
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

  useEffect(() => {
    console.log("data", data);
    processingData(data);
  }, [data]);

  return (
    <>
      <div id="viewDiv"></div>
      <div id="titleDiv" className="esri-widget">
        <div id="titleText">
          <Line
            height={40}
            data={{
              labels: displayData["hourlyTime"],
              datasets: [
                {
                  label: `hourly temperature ${displayData["unit"]} / timezone ${displayData["timezone"]}`,
                  backgroundColor: "rgba(151, 187, 205, 0.2)",
                  borderColor: "rgba(151, 187, 205, 1)",
                  pointBackgroundColor: "rgba(151, 187, 205, 1)",
                  pointBorderColor: "#fff",
                  data: displayData["hourlyTemperature"],
                },
              ],
            }}
          />
        </div>
      </div>
    </>
  );
};
