import React, { useEffect } from "react";
import { loadModules } from "esri-loader";
import "./WebMapView.css";

// esri-loader https://github.com/Esri/esri-loader
export const WebMapView = () => {
  useEffect(() => {
    const options = { css: true };
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(["esri/views/MapView", "esri/WebMap"], options).then(
      ([MapView, WebMap]) => {
        // basemap values https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
        const webMap = new WebMap({
          basemap: "topo-vector",
        });

        // load the map view at the map DOM node
        const mapView = new MapView({
          container: "map",
          map: webMap,
          center: [139.767125, 35.681236],
          zoom: 3,
        });

        return () => {
          if (mapView) mapView.destroy(); // destroy the map view
        };
      }
    );
  });

  return <div id="map" />;
};
