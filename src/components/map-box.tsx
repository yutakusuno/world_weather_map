import { useEffect, useState } from 'react';
import Map, {
  FullscreenControl,
  Layer,
  Marker,
  NavigationControl,
  Source,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { RasterLayer, MapLayerMouseEvent } from 'react-map-gl';

import { getRainRadarData } from '../api/rainviewer';
import { MAPBOX_ACCESS_TOKEN } from '../constants';
import { RainViewerDataType } from '../types/rainviewer';
import { HandleUpdateWeatherForecast, Point } from '../types/types';

const rasterOpacity = 0.5;

const initCustomLayer: RasterLayer[] = [
  {
    id: 'layer',
    type: 'raster',
    source: '',
    paint: { 'raster-opacity': rasterOpacity },
  },
];

type MapBoxProps = {
  latLng: Point;
  handleUpdateWeatherForecast: HandleUpdateWeatherForecast;
};

export const MapBox = ({
  latLng,
  handleUpdateWeatherForecast,
}: MapBoxProps) => {
  const [layers, setLayers] = useState<RasterLayer[]>(initCustomLayer);
  const [rainViewerData, setRainViewerData] = useState<
    RainViewerDataType | undefined
  >(undefined);

  const onMapClick = (e: MapLayerMouseEvent) => {
    handleUpdateWeatherForecast(e.lngLat, undefined);
  };

  useEffect(() => {
    let ignore = false;

    const initRainViewerData = async () => {
      const data = await getRainRadarData();

      if (!ignore) {
        setRainViewerData(data);
      }
    };

    initRainViewerData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (rainViewerData === undefined) return;
    if (
      rainViewerData.radar === undefined ||
      rainViewerData.radar.nowcast === undefined
    )
      return;

    // Collect forecast (30 minutes)
    const layerList = rainViewerData.radar.nowcast.map(
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
  }, [rainViewerData]);

  return (
    <Map
      mapLib={import('mapbox-gl')}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        latitude: latLng.lat,
        longitude: latLng.lng,
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
              `https://tilecache.rainviewer.com${layers[0].source}/512/{z}/{x}/{y}/2/1_1.png`,
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
