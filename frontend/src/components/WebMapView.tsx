import React, { useEffect, useState } from "react";
import { loadModules } from "esri-loader"; // https://github.com/Esri/esri-loader
import "./WebMapView.css";
import axios from "axios";

type Point = {
  latitude: number;
  longitude: number;
};

const initialData: Welcome = {
  latitude: 52.52,
  longitude: 13.419,
  elevation: 44.812,
  generationtime_ms: 2.2119,
  utc_offset_seconds: 0,
  timezone: "Europe/Berlin",
  timezone_abbreviation: "CEST",
  hourly: {
    time: ["2022-07-01T00:00", "2022-07-01T01:00", "2022-07-01T02:00"],
    temperature_2m: [13, 12.7, 12.7, 12.5, 12.5, 12.8, 13, 12.9, 13.3],
  },
  hourly_units: {
    temperature_2m: "°C",
  },
  current_weather: {
    time: "2022-07-01T09:00",
    temperature: 13.3,
    weathercode: 3,
    windspeed: 10.3,
    winddirection: 262,
  },
};

interface Welcome {
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

export const WebMapView: React.FC = () => {
  const [data, setData] = useState<Welcome>(initialData);
  const [date, setDate] = useState<Date>(new Date());
  const [point, setPoint] = useState<Point>({ latitude: 0, longitude: 0 });
  const [ongoing, setOngoing] = useState<Boolean>(false);
  const [searching, setSearching] = useState<Boolean>(false);

  useEffect(() => {
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
          `https://api.open-meteo.com/v1/forecast?latitude=${point.latitude}&longitude=${point.longitude}&hourly=temperature_2m`
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
    searchWeather({ latitude: point.latitude, longitude: point.longitude });
  }, [searching]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  useEffect(() => {
    // first lazy-load the esri classes
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/Zoom",
        "esri/layers/FeatureLayer",
        "esri/widgets/TimeSlider",
        "esri/widgets/Expand",
        "esri/widgets/Legend",
      ],
      {
        css: true,
      }
    ).then(([Map, MapView, Zoom, FeatureLayer, TimeSlider, Expand, Legend]) => {
      const layer = new FeatureLayer({
        url: "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NDFD_Precipitation_v1/FeatureServer/0",
      });

      // Create the Map
      const map = new Map({
        basemap: "hybrid",
        layers: [layer],
      });

      // Create the MapView
      const mapView = new MapView({
        container: "viewDiv",
        map: map,
        center: [-100, 30],
        zoom: 4,
        // Exclude the zoom widget from the default UI, because it is fixed top-left.
        ui: {
          components: ["attribution"],
        },
      });

      const zoom = new Zoom({
        view: mapView,
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

      mapView.whenLayerView(layer).then((lv: any) => {
        if (!document.getElementById("timeSlider")?.hasChildNodes())
          // https://developers.arcgis.com/javascript/latest/sample-code/widgets-timeslider/
          // time slider widget initialization
          new TimeSlider({
            container: "timeSlider",
            view: mapView,
            timeVisible: true, // show the time stamps on the timeslider
            loop: false,
            fullTimeExtent: layer.timeInfo.fullTimeExtent.expandTo("hours"),
            stops: {
              interval: layer.timeInfo.interval,
            },
          });
      });

      // add the UI for a title
      mapView.ui.add(zoom, "bottom-right");
      mapView.ui.add("titleDiv", "top-right");
      mapView.ui.add(legendExpand, "top-left");

      // we show that map in a container
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

  return (
    <>
      <div id="viewDiv"></div>
      <div id="timeSlider"></div>
      <div id="titleDiv" className="esri-widget">
        <div id="titleText">Precipitation forecast for next 72 hours</div>
      </div>
    </>
  );
};
