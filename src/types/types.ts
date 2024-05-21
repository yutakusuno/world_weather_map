export type Point = {
  lat: number;
  lng: number;
};

export type HandleUpdateWeatherForecast = (
  point: Point,
  timezone: string | undefined
) => Promise<void>;

export type Timezone = {
  label: string;
  value: string;
};
