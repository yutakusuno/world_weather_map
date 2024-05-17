type RadarData = {
  time: number;
  path: string;
};

type SatelliteData = {
  time: number;
  path: string;
};

type RadarInfo = {
  past: RadarData[];
  nowcast: RadarData[];
};

type SatelliteInfo = {
  infrared: SatelliteData[];
};

export type RainViewerData = {
  version: string;
  generated: number;
  host: string;
  radar: RadarInfo;
  satellite: SatelliteInfo;
};
