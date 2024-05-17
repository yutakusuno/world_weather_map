import { useEffect, useState } from 'react';
import Map, {
  FullscreenControl,
  Layer,
  Marker,
  NavigationControl,
  Source,
} from 'react-map-gl';
import type { RasterLayer, MapLayerMouseEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { getRainRadarData } from '../api/rainviewer';
import { MAPBOX_ACCESS_TOKEN } from '../constants';
import { RainViewerData } from '../types/rainviewer';
import { HandleUpdateWeatherForecast, Point } from '../types/types';

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

export const MapBox = ({
  handleUpdateWeatherForecast,
}: HandleUpdateWeatherForecast) => {
  const [latLng, setLatLng] = useState<Point>(initPoint);
  const [resData, setResData] = useState<RainViewerData | undefined>(undefined);
  const [layers, setLayers] = useState<RasterLayer[]>(initCustomLayer);

  const onMapClick = (e: MapLayerMouseEvent) => {
    setLatLng(e.lngLat);
    handleUpdateWeatherForecast(e.lngLat, undefined);
  };

  useEffect(() => {
    const setWeatherMapData = async () => {
      const data = await getRainRadarData();

      setResData(data);
      handleUpdateWeatherForecast(initPoint, undefined);
    };

    setWeatherMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO Check the rain radar layers whether it displays correctly or not
  useEffect(() => {
    if (resData === undefined) return;
    if (resData.radar === undefined || resData.radar.past === undefined) return;

    const layerList = resData.radar.past.map(
      (frame: { path: string }): RasterLayer => {
        return {
          id: `rainviewer_${frame.path}`,
          type: 'raster',
          source: frame.path,
          paint: { 'raster-opacity': rasterOpacity },
        };
      }
    );
    setLayers(layerList);
  }, [resData]);

  return (
    <Map
      mapLib={import('mapbox-gl')}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
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
      <Marker latitude={latLng.lat} longitude={latLng.lng} anchor='center' />
      <FullscreenControl />
      <NavigationControl />
      {layers.map((val: RasterLayer) => {
        return (
          <Source
            key={val.source}
            id={val.source}
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
