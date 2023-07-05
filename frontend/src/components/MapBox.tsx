import React from "react";
import Map, { FullscreenControl, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

type Point = {
  lat: number;
  lng: number;
};

export const MapBox: React.FC<any> = ({ getWeatherData }) => {
  const onMapClick = (e: any) => {
    const point: Point = e.lngLat;
    getWeatherData(point);
  };

  return (
    <Map
      mapLib={import("mapbox-gl")}
      mapboxAccessToken={mapboxAccessToken}
      initialViewState={{
        longitude: 0,
        latitude: 50,
        zoom: 3,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      onClick={(e) => {
        onMapClick(e);
      }}
    >
      <FullscreenControl />
      <NavigationControl />
    </Map>
  );
};
