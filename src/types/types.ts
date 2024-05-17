export type Point = {
  lat: number;
  lng: number;
};

export type IsOpenMeteoForecastData = {
  openMeteoForecastData(point: Point, timezone: string | undefined): void;
};

export type Timezone = {
  label: string;
  value: string;
};

export type ArrayObjectSelectState = {
  selectedTimezone: Timezone | null;
};
