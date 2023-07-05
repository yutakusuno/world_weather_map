import React, { useEffect, useState } from "react";
import Map, {
  FullscreenControl,
  Layer,
  NavigationControl,
  Source,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import type { LayerProps, RasterLayer } from "react-map-gl";

const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

type Point = {
  lat: number;
  lng: number;
};

const rainViewerApiCall = async () => {
  let data: any = {};
  const url: string = "https://api.rainviewer.com/public/weather-maps.json";

  try {
    const response = await axios.get(url);
    data = response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("AxiosError", error);
    } else {
      console.error("UnexpectedError", error);
    }
  } finally {
    return data;
  }
};

export const MapBox: React.FC<any> = ({ getWeatherData }) => {
  const [resData, setResData] = useState<any>("");
  const [layers, setLayers] = useState<any>("");

  const getRainViewerData = async () => {
    const data: any = await rainViewerApiCall();
    setResData(await data);
  };

  const onMapClick = (e: any) => {
    const point: Point = e.lngLat;
    getWeatherData(point);
    getRainViewerData();
  };

  useEffect(() => {
    if (resData.radar === undefined || resData.radar.past === undefined) return;
    const layerList = resData.radar.past.map(
      (frame: { path: any }): LayerProps => {
        return {
          id: `rainviewer_${frame.path}`,
          type: "raster",
          source: `${frame.path}`,
        };
      }
    );
    setLayers(layerList);
  }, [resData]);

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
      {layers
        ? layers.map((val: RasterLayer) => {
            return (
              <Source
                key={`${val.source}`}
                id={`${val.source}`}
                type="raster"
                tiles={[
                  `${resData.host}${layers[0].source}/256/{z}/{x}/{y}/2/1_1.png`,
                ]}
                tileSize={256}
              >
                <Layer {...val} />
              </Source>
            );
          })
        : ""}
    </Map>
  );
};
