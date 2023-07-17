import React, { useEffect, useState } from "react";
import Map, {
  FullscreenControl,
  Layer,
  NavigationControl,
  Source,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { rainRadarData } from "./RainViewer";
import type { Point, IsOpenMeteoForecastData } from "./Top";
import type { RasterLayer } from "react-map-gl";

const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const initCustomLayer: RasterLayer[] = [
  {
    id: "layer",
    type: "raster",
    source: "",
  },
];

export const initPoint: Point = {
  lat: 51,
  lng: -0.1,
};

export const MapBox: React.FC<IsOpenMeteoForecastData> = ({
  openMeteoForecastData,
}) => {
  const [resData, setResData] = useState<any>("");
  const [layers, setLayers] = useState<RasterLayer[]>(initCustomLayer);

  const onMapClick = (e: any) => {
    const point: Point = e.lngLat;
    openMeteoForecastData(point, undefined);
  };

  const getRainRadarData = async () => {
    const data: any = await rainRadarData();
    setResData(await data);
  };

  useEffect(() => {
    getRainRadarData();
    openMeteoForecastData(initPoint, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resData.radar === undefined || resData.radar.past === undefined) return;
    const layerList = resData.radar.past.map(
      (frame: { path: string }): RasterLayer => {
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
        latitude: initPoint.lat,
        longitude: initPoint.lng,
        zoom: 3,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onClick={(e) => {
        onMapClick(e);
      }}
    >
      <FullscreenControl />
      <NavigationControl />
      {layers.map((val: RasterLayer) => {
        return (
          <Source
            key={`${val.source}`}
            id={`${val.source}`}
            type="raster"
            tiles={[
              `https://tilecache.rainviewer.com${layers[0].source}/256/{z}/{x}/{y}/2/1_1.png`,
            ]}
            tileSize={256}
          >
            <Layer {...val} />
          </Source>
        );
      })}
    </Map>
  );
};
