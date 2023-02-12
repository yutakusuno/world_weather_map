import React, { useEffect, useState } from "react";
import { loadModules } from "esri-loader"; // https://github.com/Esri/esri-loader
import "./WebMapView.css";
import axios from "axios";

type Point = {
  latitude: number;
  longitude: number;
};

export const WebMapView: React.FC = () => {
  const [data, setData] = useState<any>(null);
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
    loadModules(["esri/views/MapView", "esri/WebMap"], { css: true }).then(
      ([MapView, WebMap]) => {
        // https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
        const webMap = new WebMap({
          basemap: "topo-vector",
        });

        const mapView = new MapView({
          container: "map",
          map: webMap,
          center: [139.767125, 35.681236],
          zoom: 3,
        });

        mapView.on("click", (event: any) => {
          const point = mapView.toMap({ x: event.x, y: event.y });
          setPoint({ latitude: point.latitude, longitude: point.longitude });
          setSearching(true);
        });

        return () => {
          if (mapView) mapView.destroy();
        };
      }
    );
  }, []);

  return <div id="map" />;
};
