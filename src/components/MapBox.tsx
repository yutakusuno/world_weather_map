import { useEffect, useState } from 'react';
import Map, {
  FullscreenControl,
  Layer,
  Marker,
  NavigationControl,
  Source,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { RasterLayer } from 'react-map-gl';
import { IsOpenMeteoForecastData, Point } from '../types/types';
import { getRainRadarData } from '../api/rainviewer';
import { RainViewerData } from '../types/rainviewer';

const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const rasterOpacity = 0.1;

const initCustomLayer: RasterLayer[] = [
  {
    id: 'layer',
    type: 'raster',
    source: '',
    paint: { 'raster-opacity': rasterOpacity },
  },
];

export const initPoint: Point = {
  lat: 49.246292,
  lng: -123.116226,
};

export const MapBox = ({ openMeteoForecastData }: IsOpenMeteoForecastData) => {
  const [lat, setLat] = useState<number>(initPoint.lat);
  const [lng, setLng] = useState<number>(initPoint.lng);
  const [resData, setResData] = useState<RainViewerData | undefined>(undefined);
  const [layers, setLayers] = useState<RasterLayer[]>(initCustomLayer);

  const onMapClick = (e: any) => {
    const point: Point = e.lngLat;
    setLat(point.lat);
    setLng(point.lng);
    openMeteoForecastData(point, undefined);
  };

  useEffect(() => {
    const setWeatherMapData = async () => {
      const data = await getRainRadarData();

      setResData(await data);
      openMeteoForecastData(initPoint, undefined);
    };

    setWeatherMapData();
  }, []);

  useEffect(() => {
    if (resData === undefined) return;

    if (resData.radar === undefined || resData.radar.past === undefined) return;
    const layerList = resData.radar.past.map(
      (frame: { path: string }): RasterLayer => {
        return {
          id: `rainviewer_${frame.path}`,
          type: 'raster',
          source: `${frame.path}`,
          paint: { 'raster-opacity': rasterOpacity },
        };
      }
    );
    setLayers(layerList);
  }, [resData]);

  return (
    <Map
      mapLib={import('mapbox-gl')}
      mapboxAccessToken={mapboxAccessToken}
      initialViewState={{
        latitude: initPoint.lat,
        longitude: initPoint.lng,
        zoom: 9,
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle='mapbox://styles/mapbox/streets-v12'
      onClick={(e) => {
        onMapClick(e);
      }}
    >
      <Marker latitude={lat} longitude={lng} anchor='center' />

      <FullscreenControl />
      <NavigationControl />
      {layers.map((val: RasterLayer) => {
        return (
          <Source
            key={`${val.source}`}
            id={`${val.source}`}
            type='raster'
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
